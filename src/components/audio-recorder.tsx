'use client'

import speechToTextRequest from '@/lib/helper-agents/speect-to-text-request';
import React, { useState, useRef } from 'react';
import { Button } from './ui/button';
import { CircleNotch, Microphone, Stop } from '@phosphor-icons/react';
import { toast } from 'sonner';
import {
    Tooltip,
    TooltipContent,
    TooltipProvider,
    TooltipTrigger,
} from "@/components/ui/tooltip"


const maxTimeout = 20000

export default function AudioRecorder({
    setLoading,
    setInput,
    loading

}: {
    loading: boolean
    setLoading: (loading: boolean) => void
    setInput: (value: string) => void
}) {
    const [isRecording, setIsRecording] = useState(false);
    const [audioData, setAudioData] = useState<Blob | null>(null);
    const mediaRecorderRef = useRef<MediaRecorder | null>(null);
    const [stream, setStream] = useState<MediaStream | null>(null);
    const isMounted = useRef(false);


    const startRecording = async () => {
        try {
            setAudioData(null);

            const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
            setStream(stream);
            const mediaRecorder = new MediaRecorder(stream);

            mediaRecorder.start();
            setIsRecording(true);

            const chunks: Blob[] = [];

            mediaRecorder.ondataavailable = (event) => {
                if (event.data && event.data.size > 0) {
                    chunks.push(event.data);
                }
            };




            mediaRecorder.onstop = () => {
                const audioBlob = new Blob(chunks, { type: 'audio/wav' });
                setAudioData(audioBlob);
                setIsRecording(false);

                // proceed further only if component is mounted
                if (isMounted.current) {
                    setLoading(true);
                    const reader = new FileReader();
                    reader.readAsDataURL(audioBlob);
                    reader.onloadend = async () => {
                        const base64Data = reader.result?.toString().split(',')[1] || null;

                        if (base64Data === null) {
                            return;
                        }

                        const response = await speechToTextRequest({
                            base64Audio: base64Data
                        });

                        setAudioData(null);
                        setLoading(false);

                        const { error, text } = response;
                        if (error) {
                            toast.error(error);
                            return;
                        }
                        if (text === undefined || text?.length === 0) {
                            toast.error('No transcription found');
                            return;
                        }
                        setInput(text);
                        setLoading(false);
                    };
                }


            };

            setTimeout(() => {
                if (mediaRecorder.state === 'recording') {
                    stopRecording();
                }
            }, maxTimeout);

            mediaRecorderRef.current = mediaRecorder;
        } catch (error) {
            console.error('Error accessing media devices:', error);
        }
    };

    const stopRecording = () => {
        if (mediaRecorderRef.current) {

            mediaRecorderRef.current.stop();
            mediaRecorderRef.current = null;
            setIsRecording(false);
            // Stop and release the media stream
            if (stream) {
                stream.getTracks().forEach(track => track.stop());
                setStream(null);
            }
        }
    };


    // check if component is mounted (ie user navigate away from the page)
    React.useEffect(() => {
        isMounted.current = true;

        return () => {
            isMounted.current = false;
        };
    }, []);





    return <Tooltip>
        <TooltipTrigger asChild>
            <Button
                type='button'
                disabled={loading}
                variant="ghost"
                size="icon"
                className="absolute left-4 top-1/2  transform -translate-y-1/2 size-8  p-0 sm:left-4"

                onClick={() => {
                    isRecording ? stopRecording() : startRecording()
                }}

            >
                {
                    loading ?
                        <CircleNotch size={20} className='animate-spin' /> :
                        isRecording ? <Stop weight='fill' color='red' size={20} /> : <Microphone size={20} />
                }

                <span className="sr-only">New Audio</span>
            </Button>
        </TooltipTrigger>
        <TooltipContent className=''>
            <p>Convert audio to texts.
                <br />
                Max duration: {maxTimeout / 1000} seconds
            </p>
        </TooltipContent>
    </Tooltip >



};



