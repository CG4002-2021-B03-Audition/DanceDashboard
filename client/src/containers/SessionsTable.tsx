import { Search2Icon } from '@chakra-ui/icons';
import { Box, Container, InputLeftElement, Input, InputGroup, Text } from '@chakra-ui/react';
import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { setSearchText } from '../store/session/actions';
import { Session } from '../store/session/types'

interface Props {
    onClick: (session : any) => void | undefined
}

const selectSessions = (state : any) => {
    return state.sessionStore.sessions.filter((session : Session) => {
        if (state.sessionStore.searchText.length === 0) return true
        return session.sid.toString() === state.sessionStore.searchText
    })
}
const getSearchText = (state : any) => state.sessionStore.searchText

const SessionsTable: React.FC<Props> = ({ onClick }) => {
    const dispatch = useDispatch()
    const searchText = useSelector(getSearchText)
    const allSessions = useSelector(selectSessions)
    const rows = allSessions.map((session : Session) => {
        return (
            <Box key={session.sid} m={2} bg="gray.200" w="100%" rounded="md">
                <Text 
                    cursor="pointer" 
                    letterSpacing={2} 
                    textAlign="center" 
                    onClick={() => onClick(session)}
                >
                    {`#${session.sid}`}
                </Text>
            </Box>
        )
    })

    const handleChange = (event : any) => {
        dispatch(setSearchText(event.target.value))
    }

    return (
        <>
            <Container>
                <InputGroup >
                    <InputLeftElement
                        pointerEvents="none"
                        children={<Search2Icon color="gray.300" />}
                    />
                    <Input 
                        value={searchText}
                        type="tel" 
                        placeholder="Find session" 
                        onChange={handleChange}
                    />
                </InputGroup>
            </Container>
            <Container 
                centerContent
                overflowY="scroll"
                h="48rem"
            >
                {(rows.length === 0) ? "No sessions found!" : rows}
            </Container>
        </>
    )
}

export default SessionsTable;