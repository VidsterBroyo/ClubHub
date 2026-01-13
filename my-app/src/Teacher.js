import React, { useEffect, useState } from 'react';
import { useAuth0 } from "@auth0/auth0-react";
import {
    Flex,
    Box,
    Heading,
    Text,
    useDisclosure
} from "@chakra-ui/react";


function Teacher() {
    const { user } = useAuth0();
    const [teacherRequests, setTeacherRequests] = useState([]);
    const [points, setPoints] = useState(0);
    const { isOpen, onOpen, onClose } = useDisclosure();


    async function fetchTeacherRequests() {
        console.log("fetching TRs");
        try {
            const response = await fetch("http://localhost:3001/get-requests", {
                method: "GET",
                headers: {
                    "Content-Type": "application/json",
                },
            });

            if (response.ok) {
                const data = await response.json();
                setTeacherRequests(data.requests);
                console.log("response from fetch:", data.requests);
            } else {
                throw new Error("Failed to fetch clubs");
            }
        } catch (error) {
            console.error("Error fetching req:", error);
        }
    }

    async function fetchPoints() {
        console.log("fetching points");
        try {
            const response = await fetch("http://localhost:3001/get-points", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    userId: user?.sub,
                }),
            });

            if (response.ok) {
                const data = await response.json();
                console.log(data)

            
                console.log("response from fetch:", data.points);
                setPoints(data.points)
            } else {
                throw new Error("Failed to fetch user metadata");
            }

        } catch (error) {
            console.error("Error fetching user metadata:", error);
        }
    }


    useEffect(() => {
        fetchTeacherRequests()
        fetchPoints()
    }, []);




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
                Club Requests
            </Heading>

            <Flex justifyContent="space-between" style={{margin: "auto", marginTop: 0, marginBottom: 0}} alignItems="center" width="70%" px={4} py={2} bg="gray.800">
                <Text fontWeight="bold" color="white">Your Points: {points}</Text>
            </Flex>

            {/* Class Container */}
            <Box>


                {teacherRequests.map((request, index) => (
                    <Box key={index} style={{ margin: "auto" }} width="70%">
                        <Box
                            bg={(request.type == "supervisor") ? "red.400" : (request.type == "expertise") ? "purple.300" : "blue.400"}
                            onClick={() => {
                                console.log("hi")
                            }}

                            cursor="pointer"
                            transition="all 0.3s ease-in-out"
                            boxShadow="0 4px 6px rgba(0, 0, 0, 0.1)"
                            borderRadius="lg"
                            _hover={{
                                transform: "translateY(-5px)",
                                boxShadow: "0 10px 20px rgba(0, 0, 0, 0.2)"
                            }}
                            p={3}
                            mt={3}
                        >
                            <Flex direction="column" align="center">
                                <Text
                                    align="center"
                                    fontFamily="Montserrat, sans-serif"
                                    fontWeight="bold"
                                    color="purple.800"
                                >
                                    {request.club}
                                </Text>
                                <Text>
                                    {request.details}
                                </Text>
                                <Text>
                                    Points: {request.points}
                                </Text>
                            </Flex>
                        </Box>
                    </Box>

                ))}


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

export default Teacher;
