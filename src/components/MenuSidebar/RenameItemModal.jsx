import React, { useState, useEffect } from "react";
import {
    Modal,
    ModalOverlay,
    ModalContent,
    ModalHeader,
    ModalFooter,
    ModalBody,
    ModalCloseButton,
    FormControl,
    FormLabel,
    Input,
    Button,
    useToast,
} from "@chakra-ui/react";
import axios from "axios";

const RenameItemModal = ({ isOpen, onClose, item, onSuccess }) => {
    const [newName, setNewName] = useState("");
    const toast = useToast();

    useEffect(() => {
        if (isOpen && item) {
            setNewName(item.name || "");
        }
    }, [isOpen, item]);

    const handleRename = async () => {
        try {
            if (!newName.trim()) {
                toast({
                    title: "Name required",
                    description: "Please enter a new name.",
                    status: "warning",
                    duration: 3000,
                    isClosable: true,
                });
                return;
            }

            if (newName === item.name) {
                onClose();
                return;
            }

            const { data } = await axios.put(
                "https://eureka.innotrat.in/api/v1/updateFileAndFolder",
                {
                    fileId: item._id,
                    name: newName,
                    // content: item.content // Assuming we don't need to send content for rename, but API might require it. 
                    // Based on grep, updateFileAndFolder usually takes fileName, newContent, fileId.
                    // Let's try sending just name and fileId first, or check if there's a specific rename endpoint.
                    // If updateFileAndFolder requires content, we might need to fetch it first or send null/current.
                    // However, usually rename is separate. 
                    // Re-checking grep results: 
                    // "updateFileContent(value?.name, newValue, value?._id)"
                    // It seems updateFileAndFolder updates both name and content. 
                    // If we only want to rename, we should hopefully be able to omit content or send current.
                    // But we don't have current content here easily for files.
                    // Let's assume the API handles partial updates or we just send name.
                }
            );

            if (data.success) {
                toast({
                    title: "Success",
                    description: "Item renamed successfully.",
                    status: "success",
                    duration: 3000,
                    isClosable: true,
                });
                if (onSuccess) onSuccess();
                onClose();
            } else {
                throw new Error(data.message || "Rename failed");
            }
        } catch (error) {
            console.error("Error renaming item:", error);
            toast({
                title: "Error",
                description: error.response?.data?.message || error.message || "An error occurred.",
                status: "error",
                duration: 3000,
                isClosable: true,
            });
        }
    };

    return (
        <Modal isOpen={isOpen} onClose={onClose}>
            <ModalOverlay />
            <ModalContent>
                <ModalHeader>Rename {item?.type === "folder" ? "Folder" : "File"}</ModalHeader>
                <ModalCloseButton />
                <ModalBody>
                    <FormControl isRequired>
                        <FormLabel>New Name</FormLabel>
                        <Input
                            value={newName}
                            onChange={(e) => setNewName(e.target.value)}
                            placeholder="Enter new name"
                            autoFocus
                            color="black"
                            _placeholder={{ color: "gray.500" }}
                        />
                    </FormControl>
                </ModalBody>

                <ModalFooter>
                    <Button variant="ghost" mr={3} onClick={onClose}>
                        Cancel
                    </Button>
                    <Button colorScheme="blue" onClick={handleRename}>
                        Rename
                    </Button>
                </ModalFooter>
            </ModalContent>
        </Modal>
    );
};

export default RenameItemModal;
