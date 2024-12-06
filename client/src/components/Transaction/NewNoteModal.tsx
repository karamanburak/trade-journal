import React, { useState } from "react";
import { MdClose } from "react-icons/md";
import MenuButton from "../Ui/Buttons/MenuButton";

interface INewNoteModalProps {
    isVisible: boolean;
    onClose: () => void;
    onSave: (note: string) => void;
}

const NewNoteModal: React.FC<INewNoteModalProps> = ({ isVisible, onClose, onSave }) => {
    const [noteContent, setNoteContent] = useState("");

    const handleSave = () => {
        if (noteContent.trim()) {
            onSave(noteContent);
            setNoteContent("");
        }
    };

    if (!isVisible) return null;

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-light-secondary dark:bg-dark-background2 p-6 rounded-lg w-2/3 md:w-1/3">
                <div className="flex justify-between mb-4">
                    <h2 className="text-xl font-semibold">Create New Note</h2>
                    <MdClose className="cursor-pointer" onClick={onClose} />
                </div>
                <textarea
                    value={noteContent}
                    onChange={(e) => setNoteContent(e.target.value)}
                    rows={4}
                    className="w-full p-2 border rounded-md text-dark-background2"
                    placeholder="Write your note here..."
                />
                <div className="mt-4 flex justify-end">
                    <MenuButton className="text-dark-primary hover:text-dark-primary/80" onClick={handleSave}>Save Note</MenuButton>
                    <MenuButton
                        className="ml-2 text-dark-danger hover:text-dark-danger/80"
                        onClick={onClose}
                    >
                        Cancel
                    </MenuButton>
                </div>
            </div>
        </div>
    );
};

export default NewNoteModal;
