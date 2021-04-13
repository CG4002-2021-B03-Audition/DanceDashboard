import { Button } from '@chakra-ui/button';
import { Input } from '@chakra-ui/input';
import { Divider, Stack, Text } from '@chakra-ui/layout';
import { useToast } from '@chakra-ui/toast';
import React, { useEffect, useState } from 'react'
import { fetchDataInSession, sendSessionResult, updateSessionName } from '../../apiCalls';
import ExtraStatChart from '../../containers/ExtraStatChart';
import { Session } from '../../store/session/types';
import BaseModal from './BaseModal';

interface Props {
    isOpen: boolean
    onClose: any
    session: Session | undefined
}

const SessionSummaryModal: React.FC<Props> = ({isOpen, onClose, session}) => {
    const [danceActions, setDanceActions] = useState<any[]>([])
    const [sessionName, setSessionName] = useState<string>("")
    const [isSelected, setSelected] = useState<any[]>([])
    const toast = useToast()
    useEffect(() => {
        async function getDanceActions(sessionId : number) {
            const resp = await fetchDataInSession(sessionId)
            if (resp.data.success && resp.data.message !== null) {
                setDanceActions([...resp.data.message])
                setSelected([...resp.data.message.map(() => false)])
            }
        }
        if (session !== undefined) { getDanceActions(session.sid) }
    }, [session])

    const handleNameChange = (event : any) => {
        setSessionName(event.target.value)
    }

    const handleClick = (i : number) => {
        let items = [...isSelected]
        items[i] = !items[i]
        setSelected([...items])
    }

    const handleSubmit = async () => {
        let items = [...danceActions]
        items.forEach((item : any, index: number) => {
            item.isCorrect = isSelected[index] 
        })

        if (session !== undefined) {
            let updateSuccess = true
            if (sessionName !== "") {
                const updateResp = await updateSessionName({
                    sid: session.sid,
                    name: sessionName,
                })
                updateSuccess = (updateResp.data.success) ? true : false
            }
            
            const resp = await sendSessionResult(items, session.sid)
            if (resp.data.success && updateSuccess) {
                toast({
                    title: "Session saved.",
                    status: "success",
                    duration: 9000,
                    isClosable: true,
                })
                onClose()
            } else {
                toast({
                    title: "Session is already saved!",
                    status: "warning",
                    duration: 9000,
                    isClosable: true,
                })
            }
        }
    }

    return (
        <BaseModal isOpen={isOpen} onClose={onClose} onSubmit={handleSubmit} modalTitle="Session Summary" modalSize="5xl">
            <Text textAlign="center" fontWeight="bold" letterSpacing="wide"> SESSION NAME </Text>
            <Text textAlign="center" fontSize="xs" letterSpacing="wider"> enter the name of this session </Text>
            <Input placeholder="e.g. Dynamite BTS Best Dance!" size="lg" onChange={handleNameChange} value={sessionName}/>
            <Divider m={2}/>
            <Text textAlign="center" fontWeight="bold" letterSpacing="wide"> MOVES COMPLETED </Text>
            <Text textAlign="center" fontSize="xs" letterSpacing="wider"> select all moves that were correct </Text>
            <Divider m={2}/>
            {danceActions.map((action : any, i : any) => {
                const buttonColor = (isSelected[i] ? "green.100" : "gray.100")
                return (
                    <Button 
                        key={action.timestamp}
                        variant="solid" 
                        w="15%"
                        rounded="md" 
                        bg={buttonColor} 
                        p={2} 
                        m={2} 
                        onClick={() => handleClick(i)}
                        _hover={{ bg: buttonColor }}
                    >
                        {`${i+1}. ${action.name}`}
                    </Button>
                )
            })}
            <Text textAlign="center" fontWeight="bold" letterSpacing="wide" m={4}> PERFORMANCE </Text>
            <Divider m={2}/>
            <Stack justify="center" isInline spacing={6}>
                <ExtraStatChart danceData={danceActions}/>
            </Stack>
        </BaseModal>
    )
}

export default SessionSummaryModal;