import React, { useEffect, useState } from 'react';
import { useAuth0 } from "@auth0/auth0-react";
import {
    Flex,
    Box,
    Heading,
    Wrap,
    WrapItem,
    Image,
    Text,
    VStack,
    Modal,
    ModalOverlay,
    ModalContent,
    ModalHeader,
    ModalCloseButton,
    ModalBody,
    ModalFooter,
    Button,
    FormControl,
    FormLabel,
    Input,
    useDisclosure
} from "@chakra-ui/react";


function Student() {
    const { user } = useAuth0();
    const [clubs, setClubs] = useState([]);
    const [currentClub, setCurrentClub] = useState({
        "name": "hi",
        "room": "room 209",
        "teacher": "mr. p",
        "img": "miage",
        "desc": "test"
    });
    const { isOpen, onOpen, onClose } = useDisclosure();
   


    async function fetchUserType() {
        console.log("fetching usermetadata");
        try {
            // const response = await fetch("https://beta.minvestfinance.com:3001/get-user-metadata", {
            const response = await fetch("http://localhost:3001/get-user-type", {
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

            if (data.type == "student"){
                console.log("ur a student")
            } else if (data.type == "teacher"){
                window.location.href = "teacher"
            } else if (data.type == "owner"){
                window.location.href = "owner"
            }
    
            console.log("response from fetch:", data.type);
          } else {
            throw new Error("Failed to fetch user metadata");
          }
    
        } catch (error) {
          console.error("Error fetching user metadata:", error);
        }
      }
    



    async function fetchClubs() {
        console.log("fetching clubs");
        try {
            const response = await fetch("http://localhost:3001/get-clubs", {
                method: "GET",
                headers: {
                    "Content-Type": "application/json",
                },
            });

            if (response.ok) {
                const data = await response.json();
                setClubs(data.clubs);
                console.log("response from fetch:", data.clubs);
            } else {
                throw new Error("Failed to fetch clubs");
            }
        } catch (error) {
            console.error("Error fetching clubs:", error);
        }
    }

    useEffect(() => {
        fetchUserType()
        fetchClubs();
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
                Clubs
            </Heading>

            {/* Class Container */}
            <VStack
                bg="white"
                p={5}
                borderRadius="lg"
                boxShadow="lg"
                width="100%"
                maxW="1200px"
                mx="auto"
                overflowY="auto"
                spacing={5}
                height="400px"
                border="2px dashed gray"
            >

                <Wrap spacing={"10px"} mt={4}>

                    {clubs.map((club, index) => (
                        <WrapItem key={index}>
                            <Box
                                bg="purple.100"
                                onClick={() => {
                                    setCurrentClub(club);
                                    onOpen()
                                }}
                                cursor="pointer"
                                transition="all 0.3s ease-in-out"
                                boxShadow="0 4px 6px rgba(0, 0, 0, 0.1)"
                                borderRadius="lg"
                                _hover={{
                                    transform: "translateY(-5px)",
                                    boxShadow: "0 10px 20px rgba(0, 0, 0, 0.2)"
                                }}
                            >
                                <Flex direction="column" align="center">
                                    <Image
                                        src={club.img}
                                        boxSize="250px"
                                        objectFit="cover"
                                    />
                                    <Box p={3}>
                                        <Text
                                            align="center"
                                            fontFamily="Montserrat, sans-serif"
                                            fontWeight="bold"
                                            color="purple.800"
                                        >
                                            {club.name}
                                        </Text>
                                    </Box>
                                </Flex>
                            </Box>
                        </WrapItem>

                    ))}

                   
                </Wrap>
            </VStack>

            
            <Modal isOpen={isOpen} onClose={onClose}>
                <ModalOverlay />
                <ModalContent>
                    <ModalHeader>
                        {currentClub.name}
                    </ModalHeader>
                    <ModalCloseButton />
                    <ModalBody>
                        <Text>
                            {currentClub.room + ", " + currentClub.teacher}
                            <br></br>
                        </Text>
                        <Text>
                            {currentClub.desc}
                        </Text>
                    </ModalBody>
                    <ModalFooter>
                        <Button variant="ghost" onClick={onClose}>
                            Cancel
                        </Button>
                    </ModalFooter>
                </ModalContent>
            </Modal>

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

export default Student;
