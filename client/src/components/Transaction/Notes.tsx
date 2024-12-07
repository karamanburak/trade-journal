import React, { useState } from "react";
import { formatDateWithTime } from "../../helpers/formatDate";
import MenuButton from "../Ui/Buttons/MenuButton";
import NewNoteModal from "./NewNoteModal";
import { MdNoteAlt } from "react-icons/md";
import { useSelector } from "react-redux";
import type { RootState } from "../../app/store";
import useNoteCall from "../../hooks/useNoteCall";

interface INote {
    content: string;
    createdAt: string;
    _id: string;
}

interface INotesProps {
    notes: INote[];
    tradeId: string;
}

const Notes: React.FC<INotesProps> = ({ notes, tradeId }) => {
    const { currentUser } = useSelector((state: RootState) => state.auth);
    const [isModalVisible, setIsModalVisible] = useState(false);
    const { postNote, deleteNote } = useNoteCall();

    const handleCreateNewNote = (noteContent: string) => {
        if (currentUser?._id) {
            postNote(tradeId, currentUser._id, noteContent);
            setIsModalVisible(false);
        } else {
            console.log("User not logged in");
        }
    };

    const handleDeleteNote = async (noteId: string) => {
        if (currentUser?._id) {
            await deleteNote(noteId);
        }
    };

    return (
        <div className="w-full px-4">
            <MenuButton onClick={() => setIsModalVisible(true)} className="block ml-auto bg-light-background3/40 px-2 rounded-md dark:bg-dark-background3">
                Create new Note
            </MenuButton>

            {/* Modal for creating a new note */}
            <NewNoteModal
                isVisible={isModalVisible}
                onClose={() => setIsModalVisible(false)}
                onSave={handleCreateNewNote}
            />

            <div className="dark:bg-dark-background2 rounded-lg p-6 space-y-4">
                {notes && notes.length > 0 ? (
                    notes
                        .slice()
                        .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
                        .map((note, index) => (
                            <div key={index} className="bg-light-secondary dark:bg-dark-background3 p-4 rounded-lg flex items-start justify-between">
                                <div className="flex-1">
                                    <p className="text-lg font-medium">{note.content}</p>
                                    <span className="text-sm">{formatDateWithTime(note.createdAt)}</span>
                                </div>
                                <div
                                    className="cursor-pointer ml-4"
                                    onClick={() => handleDeleteNote(note._id)}
                                >
                                    x
                                </div>
                            </div>
                        ))
                ) : (
                    <div className="flex flex-col justify-center items-center">
                        <MdNoteAlt className="text-6xl" />
                        <p className=" text-lg font-medium"> No notes yet.</p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default Notes;
