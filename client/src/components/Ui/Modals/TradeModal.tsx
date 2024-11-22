import React, { useState, useEffect } from "react";
import {
    Box,
    Modal,
    Typography,
    TextField,
    Stack,
} from "@mui/material";
import toastNotify from "../../../utils/toastNotify";
import MenuButton from "../Buttons/MenuButton";

interface TradeModalProps {
    show: boolean;
    onHide: () => void;
    tradeData: {
        symbol: string;
        price: number;
        transactionType: "BUY" | "SELL";
    };
    onSubmit: (data: { quantity: number, price: number }) => void;
}

const TradeModal: React.FC<TradeModalProps> = ({
    show,
    onHide,
    tradeData,
    onSubmit,
}) => {
    const [quantity, setQuantity] = useState<number>(0);
    const [price, setPrice] = useState<number>(tradeData.price);


    const handleSubmit = () => {
        if (quantity <= 0 || price <= 0) {
            toastNotify("warn", "Please enter valid quantity and price.");
            return;
        }
        onSubmit({ quantity, price });
        onHide();
    };

    return (
        <Modal open={show} onClose={onHide}>
            <Box
                sx={{
                    position: "absolute",
                    top: "50%",
                    left: "50%",
                    transform: "translate(-50%, -50%)",
                    width: 600,
                    bgcolor: "background.paper",
                    boxShadow: 24,
                    p: 4,
                    borderRadius: 2,
                }}
            >
                <Typography variant="h6" component="h2" sx={{ mb: 2, color: "gray" }}>
                    {tradeData.transactionType} {tradeData.symbol}
                </Typography>

                <Stack spacing={2}>
                    <TextField
                        label="Symbol"
                        value={tradeData.symbol}
                        fullWidth
                        disabled
                    />
                    <TextField
                        label="Price"
                        value={price}
                        type="number"
                        fullWidth
                        onChange={(e) => setPrice(parseFloat(e.target.value))}
                    />
                    <TextField
                        label="Transaction Type"
                        value={tradeData.transactionType}
                        fullWidth
                        disabled
                    />
                    <TextField
                        label="Quantity"
                        type="number"
                        fullWidth
                        value={quantity}
                        onChange={(e) => setQuantity(parseInt(e.target.value))}
                    />
                </Stack>

                <Box
                    sx={{
                        display: "flex",
                        justifyContent: "flex-end",
                        gap: 2,
                        mt: 3,
                    }}
                >
                    <MenuButton onClick={onHide} className="bg-dark-danger hover:bg-dark-danger/70 py-2 px-4 rounded text-white">
                        Cancel
                    </MenuButton>
                    <MenuButton className="px-4 py-2 bg-dark-primary hover:bg-dark-primary/70 rounded text-white" onClick={handleSubmit}>
                        {tradeData.transactionType === "BUY" ? "Buy" : "Sell"}
                    </MenuButton>
                </Box>
            </Box>
        </Modal>
    );
};

export default TradeModal;
