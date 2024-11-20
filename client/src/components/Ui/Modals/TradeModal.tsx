import React, { useState } from "react";
import {
    Box,
    Modal,
    Typography,
    TextField,
    Button,
    Stack,
} from "@mui/material";
import toastNotify from "../../../utils/toastNotify";


interface TradeModalProps {
    show: boolean;
    onHide: () => void;
    tradeData: {
        symbol: string;
        price: number;
        transactionType: "BUY" | "SELL";
    };
    onSubmit: (data: { quantity: number }) => void;
}

const TradeModal: React.FC<TradeModalProps> = ({
    show,
    onHide,
    tradeData,
    onSubmit,
}) => {
    const [quantity, setQuantity] = useState<number>(0);

    const handleSubmit = () => {
        if (quantity <= 0) {
            toastNotify("warn", "Please enter a valid quantity.");
            return;
        }
        onSubmit({ quantity });
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
                    />
                    <TextField
                        label="Price"
                        value={tradeData.price}
                        fullWidth
                    />
                    <TextField
                        label="Transaction Type"
                        value={tradeData.transactionType}
                        fullWidth

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
                    <Button variant="outlined" onClick={onHide}>
                        Cancel
                    </Button>
                    <Button variant="contained" color="primary" onClick={handleSubmit}>
                        Submit
                    </Button>
                </Box>
            </Box>
        </Modal>
    );
};

export default TradeModal;
