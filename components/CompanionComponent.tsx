'use client'

import React, { useEffect, useRef, useState } from 'react'
import { getSubjectColor } from './CompanionsList'
import { cn, configureAssistant } from '@/lib/utils'
import { vapi } from '@/lib/vapi.sdk'
import soundwaves from '@/constants/soundwaves.json'
import Lottie, { LottieRefCurrentProps } from 'lottie-react'
import { addToSessionHistory } from '@/lib/actions/companion.action'
import Image from 'next/image'

enum CallStatus {
  INACTIVE = 'INACTIVE',
  CONNECTING = 'CONNECTING',
  ACTIVE = 'ACTIVE',
  FINISHED = 'FINISHED',
}

interface SavedMessage {
  role: string
  content: string
}

interface Message {
  type: string
  role: string
  transcript: string
  transcriptType: string
}

interface CompanionComponentProps {
  companionId: string
  subject: string
  topic: string
  name: string
  userName: string
  userImage: string | null
  style?: React.CSSProperties
  voice?: string
}

const CompanionComponent = ({
  companionId,
  subject,
  topic,
  name,
  userName,
  userImage,
  style,
  voice,
}: CompanionComponentProps) => {
  const [callStatus, setCallStatus] = useState<CallStatus>(CallStatus.INACTIVE)
  const [isSpeaking, setIsSpeaking] = useState(false)
  const [isMuted, setIsMuted] = useState(false)
  const [messages, setMessages] = useState<SavedMessage[]>([])
  const lottieRef = useRef<LottieRefCurrentProps>(null)

  useEffect(() => {
    if (lottieRef.current) {
      isSpeaking ? lottieRef.current.play() : lottieRef.current.stop()
    }
  }, [isSpeaking])

  useEffect(() => {
    const onCallStart = () => setCallStatus(CallStatus.ACTIVE);
    const onCallEnd = () => {setCallStatus(CallStatus.FINISHED)
        addToSessionHistory(companionId)
    }
    const onMessage = (message: Message) => {
      if (message.type === 'transcript' && message.transcriptType === 'final') {
        const newMessage = { role: message.role, content: message.transcript }
        setMessages((prev) => [newMessage, ...prev])
      }
    }
    const onSpeechStart = () => setIsSpeaking(true)
    const onSpeechEnd = () => setIsSpeaking(false)
    const onError = (error: Error) => console.error('Error:', error)

    vapi.on('call-start', onCallStart)
    vapi.on('call-end', onCallEnd)
    vapi.on('message', onMessage)
    vapi.on('error', onError)
    vapi.on('speech-start', onSpeechStart)
    vapi.on('speech-end', onSpeechEnd)

    return () => {
      vapi.off('call-start', onCallStart)
      vapi.off('call-end', onCallEnd)
      vapi.off('message', onMessage)
      vapi.off('error', onError)
      vapi.off('speech-start', onSpeechStart)
      vapi.off('speech-end', onSpeechEnd)
    }
  }, [])

  const toggleMicrophone = () => {
    const muted = vapi?.isMuted?.()
    vapi.setMuted(!muted)
    setIsMuted(!muted)
  }

  const handleDisconnect = async () => {
    setCallStatus(CallStatus.FINISHED)
    vapi.stop()
  }

  const handleCall = async () => {
    setCallStatus(CallStatus.CONNECTING)

    const assistantOverrides = {
      variableValues: {
        subject,
        topic,
        style,
      },
      clientMessages: ['transcript'],
      serverMessages: [],
    }

    try {
      await vapi.start(configureAssistant(voice, style), assistantOverrides)
    } catch (err) {
      console.error('Call start failed:', err)
      setCallStatus(CallStatus.INACTIVE)
    }
  }

  const getFirstName = (fullName: string) => {
    return fullName.split(' ')[0].replace(/[.,]/g, '')
  }

  return (
    <section className="flex flex-col h-[70vh]">
      <section className="flex gap-8 max-sm:flex-col">
        {/* Companion Section */}
        <div className="companion-section">
          <div
            className="companion-avatar relative"
            style={{ backgroundColor: getSubjectColor(subject) }}
          >
            <div
              className={cn(
                'absolute transition-opacity duration-1000',
                (callStatus === CallStatus.FINISHED || callStatus === CallStatus.INACTIVE) && 'opacity-100',
                callStatus === CallStatus.CONNECTING && 'opacity-100 animate-pulse'
              )}
            >
              <Image
                src={`/icons/${subject}.svg`}
                alt={subject}
                width={150}
                height={150}
                className="max-sm:w-fit"
              />
            </div>

            <div
              className={cn(
                'absolute transition-opacity duration-1000',
                callStatus === CallStatus.ACTIVE ? 'opacity-100' : 'opacity-0'
              )}
            >
              <Lottie
                lottieRef={lottieRef}
                animationData={soundwaves}
                autoplay={false}
                className="companion-lottie"
              />
            </div>
          </div>
          <p className="font-bold text-2xl">{name}</p>
        </div>

        {/* User Section */}
        <div className="user-section">
          <div className="user-avatar">
            {userImage ? (
              <Image
                src={userImage}
                alt={userName}
                height={130}
                width={130}
                className="rounded-lg"
              />
            ) : (
              <div className="w-[130px] h-[130px] bg-gray-300 rounded-lg flex items-center justify-center text-gray-600">
                No Image
              </div>
            )}
            <p className="font-bold text-2xl">{userName}</p>
          </div>

          <button
            className="btn-mic flex items-center gap-2 mt-4"
            onClick={toggleMicrophone}
            disabled={callStatus !== CallStatus.ACTIVE}
          >
            <Image
              src={isMuted ? '/icons/mic-off.svg' : '/icons/mic-on.svg'}
              alt="mic"
              height={36}
              width={36}
            />
            <p className="max-sm:hidden">
              {isMuted ? 'Turn On Mic' : 'Turn Off Mic'}
            </p>
          </button>

          <button
            className={cn(
              'rounded-lg py-2 cursor-pointer transition-colors w-full text-white mt-4',
              callStatus === CallStatus.ACTIVE ? 'bg-red-700' : 'bg-primary',
              callStatus === CallStatus.CONNECTING && 'animate-pulse'
            )}
            onClick={callStatus === CallStatus.ACTIVE ? handleDisconnect : handleCall}
          >
            {callStatus === CallStatus.ACTIVE
              ? 'End Session'
              : callStatus === CallStatus.CONNECTING
              ? 'Connecting...'
              : 'Start Session'}
          </button>
        </div>
      </section>

      {/* Transcript Section */}
      <section className="transcript">
        <div className="transcript-message no-scrollbar">
          {messages.map((message, index) => {
            if (message.role === 'assistant') {
              return (
                <p key={index} className="max-sm:text-sm">
                  {getFirstName(name)}: {message.content}
                </p>
              )
            } else {
              return (
                <p key={index} className="text-primary max-sm:text-sm">
                  {userName}: {message.content}
                </p>
              )
            }
          })}
        </div>
{/*         <div className="transcript-fade" /> */}
      </section>
    </section>
  )
}

export default CompanionComponent
