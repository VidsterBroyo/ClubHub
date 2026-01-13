import React, { useEffect, useState } from 'react';
import { useAuth0 } from "@auth0/auth0-react";
import {
    Flex,
    Box,
    Heading,
    Text,
    Button,
    FormControl,
    FormLabel,
    Input,
    useDisclosure
} from "@chakra-ui/react";



function Owner() {
    const { user } = useAuth0();
    const { isOpen, onOpen, onClose } = useDisclosure();
    const [club, setClub] = useState({
        "name": "Loading",
        "room": "room 209",
        "teacher": "mr. p",
        "img": "miage",
        "desc": "test"
    });

    const [requestType, setRequestType] = useState('');
    const [requestDesc, setRequestDesc] = useState('');
    const [requestPoints, setRequestPoints] = useState(0);


    async function fetchClubOwned() {
        console.log("fetching the club they own");
        try {
            // get the name of the club
            const response = await fetch("http://localhost:3001/get-owned-club", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    userId: user?.sub,
                }),
            });

            const data = await response.json();
            console.log(data)
            const clubName = data.owned
            console.log(clubName)


            // get a list of all clubs
            const clubResponse = await fetch("http://localhost:3001/get-clubs", {
                method: "GET",
                headers: {
                    "Content-Type": "application/json",
                },
            });

            const clubData = await clubResponse.json();
            const clubs = clubData.clubs
            console.log("response from fetch:", clubs);


            // find the right club
            for (let i = 0; i < clubs.length; i++) {
                console.log(clubs[i])
                if (clubs[i].name == clubName) {
                    setClub(clubs[i])
                    break;
                }
            }

            if (response.ok) {
                console.log("great")
            } else {
                throw new Error("Failed to fetch clubs");
            }
        } catch (error) {
            console.error("Error fetching req:", error);
        }
    }


    useEffect(() => {
        fetchClubOwned()
    }, []);


    async function handleAddRequest(){
        console.log("adding request")

        try {

            let newRequests = {
                "type": "expertise",
                "details": requestDesc,
                "club": club.name,
                "points": requestPoints
            }
    
            var request = new XMLHttpRequest()
            request.open('POST', `http://localhost:3001/newRequest`, false)
            request.setRequestHeader("Content-type", "application/json");
            request.send(JSON.stringify(newRequests))
    
            alert("Added successfully!")

        } catch (error) {
            console.log(error)
        }
    }



    return (
        <Flex minH="100vh" direction="column" bg="purple.200" p={5}>
            {/* Back Button */}
            <Box
                position="absolute"
                top={4}
                left={4}
                p={2}
                bg="gray.700"
                color="white"
                borderRadius="full"
                cursor="pointer"
                onClick={() => window.location.href = "/"}
                fontSize="2xl"
                fontWeight="bold"
                textAlign="center"
                width="40px"
                height="40px"
                display="flex"
                alignItems="center"
                justifyContent="center"
                _hover={{
                    bg: 'gray.600',
                    transform: 'scale(1.1)'
                }}
            >
                &lt;
            </Box>

            {/* Heading */}
            <Heading color="white" size="xl" mb={8} textAlign="center">
                {club.name}
            </Heading>


            <Text width="60%" style={{margin: "auto"}}>
                {club.desc}
            </Text>


            <Box style={{margin: "auto"}} width="60%" p={3} bgColor="gray.900" borderRadius="10px">
            <FormLabel>Type of request</FormLabel>
            <select placeholder="Type of request">
                <option value="resources">Resources</option>
                <option value="supervisor">Supervisor</option>
                <option value="expertise">Expertise</option>
            </select>


            <FormControl mt={4} mb={4}>
                <FormLabel>Request</FormLabel>
                <Input
                    value={requestDesc}
                    onChange={(e) => setRequestDesc(e.target.value)}
                    placeholder="Enter request description"
                />
            </FormControl>

            <FormControl>
                <FormLabel>Points</FormLabel>
                <Input
                    value={requestPoints}
                    onChange={(e) => setRequestPoints(e.target.value)}
                    placeholder="Enter # of points rewarded"
                />
            </FormControl>


            <Button colorScheme="blue" mt={5} mr={3} onClick={handleAddRequest}>
                Post Request
            </Button>
            </Box>


            {/* Footer */}
            <Flex
                bg="purple.500"
                color="white"
                p={4}
                justifyContent="center"
                mt="auto"
            >
                <Text>© 2024 ClubHub. All rights reserved.</Text>
            </Flex>
        </Flex>
    );
}

export default Owner;
