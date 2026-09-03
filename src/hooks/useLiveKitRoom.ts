import { useCallback, useEffect, useRef, useState } from 'react'
import {
  Room,
  RoomEvent,
  Track,
  type LocalTrack,
  type RemoteParticipant,
  type RemoteTrack,
  type RemoteTrackPublication,
} from 'livekit-client'
import { fetchCallToken } from '../services/callService'

export type CallStatus = 'idle' | 'connecting' | 'connected' | 'error'

function attachRemoteTrack(
  track: RemoteTrack,
  remoteVideo: HTMLVideoElement | null,
  remoteAudio: HTMLAudioElement | null,
) {
  if (track.kind === Track.Kind.Video && remoteVideo) {
    track.attach(remoteVideo)
  }
  if (track.kind === Track.Kind.Audio && remoteAudio) {
    track.attach(remoteAudio)
  }
}

function attachExistingRemoteTracks(
  room: Room,
  remoteVideo: HTMLVideoElement | null,
  remoteAudio: HTMLAudioElement | null,
) {
  for (const participant of room.remoteParticipants.values()) {
    for (const publication of participant.trackPublications.values()) {
      if (publication.track) {
        attachRemoteTrack(publication.track, remoteVideo, remoteAudio)
      }
    }
  }
}

function attachLocalCamera(room: Room, localVideo: HTMLVideoElement | null) {
  const camera = room.localParticipant.getTrackPublication(Track.Source.Camera)
  if (camera?.track && localVideo) {
    camera.track.attach(localVideo)
  }
}

export function useLiveKitRoom(
  enabled: boolean,
  displayName: string,
  prepared: { url: string; token: string } | null = null,
) {
  const remoteVideoRef = useRef<HTMLVideoElement>(null)
  const localVideoRef = useRef<HTMLVideoElement>(null)
  const remoteAudioRef = useRef<HTMLAudioElement>(null)
  const roomRef = useRef<Room | null>(null)

  const [status, setStatus] = useState<CallStatus>('idle')
  const [error, setError] = useState<string | null>(null)
  const [micOn, setMicOn] = useState(true)
  const [cameraOn, setCameraOn] = useState(true)
  const [remoteConnected, setRemoteConnected] = useState(false)

  const disconnect = useCallback(async () => {
    const room = roomRef.current
    roomRef.current = null
    if (room) {
      await room.disconnect()
    }
  }, [])

  useEffect(() => {
    if (!enabled) return

    let cancelled = false
    const room = new Room()
    roomRef.current = room

    const onTrackSubscribed = (
      track: RemoteTrack,
      _publication: RemoteTrackPublication,
      _participant: RemoteParticipant,
    ) => {
      attachRemoteTrack(track, remoteVideoRef.current, remoteAudioRef.current)
      if (track.kind === Track.Kind.Video) setRemoteConnected(true)
    }

    const onTrackUnsubscribed = (track: RemoteTrack) => {
      track.detach()
      if (track.kind === Track.Kind.Video) setRemoteConnected(false)
    }

    const onParticipantDisconnected = () => {
      if (room.remoteParticipants.size === 0) setRemoteConnected(false)
    }

    room.on(RoomEvent.TrackSubscribed, onTrackSubscribed)
    room.on(RoomEvent.TrackUnsubscribed, onTrackUnsubscribed)
    room.on(RoomEvent.ParticipantDisconnected, onParticipantDisconnected)

    async function join() {
      setStatus('connecting')
      setError(null)
      try {
        const credentials =
          prepared?.url && prepared.token
            ? prepared
            : await fetchCallToken(`demo-${crypto.randomUUID()}`, displayName)
        const { url, token } = credentials
        if (cancelled) return

        await room.connect(url, token)
        await room.localParticipant.enableCameraAndMicrophone()
        attachLocalCamera(room, localVideoRef.current)
        attachExistingRemoteTracks(room, remoteVideoRef.current, remoteAudioRef.current)
        if (room.remoteParticipants.size > 0) setRemoteConnected(true)
        if (!cancelled) setStatus('connected')
      } catch (err) {
        await room.disconnect()
        if (!cancelled) {
          setStatus('error')
          setError(err instanceof Error ? err.message : 'Could not join the video room.')
        }
      }
    }

    void join()

    return () => {
      cancelled = true
      room.off(RoomEvent.TrackSubscribed, onTrackSubscribed)
      room.off(RoomEvent.TrackUnsubscribed, onTrackUnsubscribed)
      room.off(RoomEvent.ParticipantDisconnected, onParticipantDisconnected)
      void room.disconnect()
      roomRef.current = null
      for (const publication of room.localParticipant.trackPublications.values()) {
        const track = publication.track as LocalTrack | undefined
        track?.stop()
      }
    }
  }, [enabled, displayName, prepared?.url, prepared?.token])

  const toggleMic = useCallback(async () => {
    const next = !micOn
    await roomRef.current?.localParticipant.setMicrophoneEnabled(next)
    setMicOn(next)
  }, [micOn])

  const toggleCamera = useCallback(async () => {
    const next = !cameraOn
    const room = roomRef.current
    await room?.localParticipant.setCameraEnabled(next)
    if (next && room) attachLocalCamera(room, localVideoRef.current)
    setCameraOn(next)
  }, [cameraOn])

  return {
    remoteVideoRef,
    localVideoRef,
    remoteAudioRef,
    status,
    error,
    micOn,
    cameraOn,
    remoteConnected,
    toggleMic,
    toggleCamera,
    disconnect,
  }
}
