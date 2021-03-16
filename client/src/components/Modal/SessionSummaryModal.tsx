import { Button } from '@chakra-ui/button';
import { Divider, Text } from '@chakra-ui/layout';
import React, { useEffect, useState } from 'react'
import { fetchDataInSession, sendSessionResult } from '../../apiCalls';
import ExtraStatChart from '../../containers/ExtraStatChart';
import BaseModal from './BaseModal';

interface Props {
    isOpen: boolean
    onClose: any
    sessionId: number | undefined
}
const SessionSummaryModal: React.FC<Props> = ({isOpen, onClose, sessionId}) => {
    const [danceActions, setDanceActions] = useState<any[]>([])
    const [isSelected, setSelected] = useState<any[]>([])
    useEffect(() => {
        async function getDanceActions(sessionId : number) {
            
            const resp = await fetchDataInSession(sessionId)
            if (resp.data.success && resp.data.message !== null) {
                setDanceActions([...resp.data.message])
                setSelected([...resp.data.message.map(() => false)])
            }
        }
        if (sessionId !== undefined) { getDanceActions(sessionId) }
    }, [sessionId])

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

        if (sessionId !== undefined) {
            const resp = await sendSessionResult(items, sessionId)
            console.log(resp)
        }
    }

    return (
        <BaseModal isOpen={isOpen} onClose={onClose} onSubmit={handleSubmit} modalTitle="Session Summary" modalSize="5xl">
            <Text textAlign="center" fontWeight="bold" letterSpacing="wide"> MOVES COMPLETED </Text>
            <Text textAlign="center" fontSize="xs" letterSpacing="wider"> select all moves that were correct </Text>
            <Divider m={2}/>
            {danceActions.map((action : any, i : any) => {
                const buttonColor = (isSelected[i] ? "green.100" : "gray.100")
                return (
                    <Button 
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
            <ExtraStatChart danceData={danceActions}/>
        </BaseModal>
    )
}

export default SessionSummaryModal;