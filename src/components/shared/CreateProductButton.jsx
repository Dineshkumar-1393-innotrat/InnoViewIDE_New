import React, { useState, useEffect } from "react";
import {
    Button,
    Modal,
    ModalOverlay,
    ModalContent,
    ModalHeader,
    ModalCloseButton,
    ModalBody,
} from "@chakra-ui/react";
import ProductEditModal from "../Product/ProductEdit/ProductEditModal";
import ProductDefinition from "../CreateProduct";

/**
 * CreateProductButton - A reusable component that handles both product creation and viewing.
 * 
 * - If product exists: Shows "View Product" (via ProductEditModal)
 * - If product missing: Shows "+ Create Product" button
 */
const CreateProductButton = () => {
    const [productId, setProductId] = useState(() => localStorage.getItem("activeProductId"));
    const [productName, setProductName] = useState(() => localStorage.getItem("activeProductName"));
    const [isModalOpen, setModalOpen] = useState(false);

    useEffect(() => {
        const handleStorageChange = () => {
            if (!isModalOpen) {
                setProductId(localStorage.getItem("activeProductId"));
                setProductName(localStorage.getItem("activeProductName"));
            }
        };
        window.addEventListener("storage", handleStorageChange);

        // Interval check for local changes that don't trigger "storage" event
        const interval = setInterval(handleStorageChange, 1000);

        return () => {
            window.removeEventListener("storage", handleStorageChange);
            clearInterval(interval);
        };
    }, [isModalOpen]);

    // If product exists, show the View Product button (wrapped in ProductEditModal)
    if (productId) {
        return (
            <ProductEditModal
                productID={productId}
                productName={productName}
                fetchFileSystem={() => { }} // Placeholder if needed
                setIsProductDefined={(val) => {
                    // Compatible interface for modal's internal update if needed, 
                    // though modal mainly uses this to clear state on delete.
                    // If val is false, we clear our state.
                    if (!val) {
                        setProductId(null);
                        setProductName(null);
                    }
                }}
            />
        );
    }

    // Otherwise, show Create Product button
    return (
        <>
            <Button
                size="sm"
                colorScheme="blue"
                variant="solid"
                borderRadius="full"
                height="32px"
                px={6}
                onClick={() => setModalOpen(true)}
            >
                + Create Product
            </Button>

            <Modal
                isOpen={isModalOpen}
                onClose={() => setModalOpen(false)}
                size="xl"
            >
                <ModalOverlay />
                <ModalContent>
                    <ModalHeader>Product Configuration</ModalHeader>
                    <ModalCloseButton />
                    <ModalBody pb={6}>
                        <ProductDefinition
                            onSuccess={() => {
                                setProductId(localStorage.getItem("activeProductId"));
                                setProductName(localStorage.getItem("activeProductName"));
                                setModalOpen(false);
                                // Trigger an event so other components can update
                                window.dispatchEvent(new Event("storage"));
                            }}
                        />
                    </ModalBody>
                </ModalContent>
            </Modal>
        </>
    );
};

export default CreateProductButton;
