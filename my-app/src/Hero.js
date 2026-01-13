import React from 'react';
import {
    Flex,
    Box,
    Heading,
    Button,
    Stack,
    Spacer,
    Text,
    Image,
    Link,
} from "@chakra-ui/react";
import { useAuth0 } from "@auth0/auth0-react";

// Hero page
function Hero() {
    const { loginWithRedirect, isAuthenticated, logout } = useAuth0();

    const handleLogin = () => {
        loginWithRedirect();
    };

    const handleLogout = () => {
        logout();
    };

    const handleRedirect = () => {
        if (isAuthenticated) {
            // Redirect to the profile page
            window.location.href = "/profile";
        } else {
            // Redirect to the login page if not authenticated
            loginWithRedirect();
        }
    };

    return (
        <Flex minH="100vh" align="center" justify="center">
            <Stack spacing={8} mx="auto" maxW="lg" py={8} px={6}>
            <Stack align="center">
                    <Heading color="#ca3df5" fontSize="5xl">ClubHub</Heading>
                </Stack>
                <Image
                    borderRadius="full"
                    boxSize="150px"
                    src="logo.png"
                    alt="Segun Adebayo"
                    style={{margin: "auto"}}
                />

                <Stack align="center">
                    <Heading fontSize="4xl">Sign in or sign up</Heading>
                </Stack>
                <Box rounded="lg" bg={"gray.700"} boxShadow="lg" p={8}>
                    <Stack spacing={4}>
                        {isAuthenticated ? (
                            <Button
                                bg="purple.400"
                                color="white"
                                onClick={handleLogout}
                                _hover={{
                                    bg: "purple.500",
                                }}
                            >
                                Log out
                            </Button>
                        ) : (
                            <>
                                <Button
                                    bg="purple.400"
                                    color="white"
                                    onClick={handleLogin}
                                    _hover={{
                                        bg: "purple.500",
                                    }}
                                >
                                    Sign in
                                </Button>
                                <Button
                                    bg="purple.400"
                                    color="white"
                                    onClick={handleLogin}
                                    _hover={{
                                        bg: "purple.500",
                                    }}
                                >
                                    Sign up
                                </Button>
                            </>
                        )}
                    </Stack>
                </Box>
            </Stack>
        </Flex>
    );
}

export default Hero;
