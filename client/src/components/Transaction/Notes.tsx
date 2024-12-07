import React, { useState } from "react";
import { formatDateWithTime } from "../../helpers/formatDate";
import { MdNoteAlt, MdDelete, MdAdd } from "react-icons/md";
import { useSelector } from "react-redux";
import type { RootState } from "../../app/store";
import useNoteCall from "../../hooks/useNoteCall";
import NewNoteModal from "./NewNoteModal";

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
        <div className="w-full">
            {/* New Note Button */}
            <button
                onClick={() => setIsModalVisible(true)}
                className=" flex items-center  bg-light-primary text-white rounded-full px-4 py-2 hover:bg-light-primary/80 transition-colors duration-300 m-2 ml-auto">
                <MdAdd className="mr-2" /> Add Note
            </button>

            {/* New Note Modal */}
            <NewNoteModal
                isVisible={isModalVisible}
                onClose={() => setIsModalVisible(false)}
                onSave={handleCreateNewNote}
            />

            {/* Notes Container */}
            <div className=" bg-white dark:bg-gray-800 shadow-sm border border-light-border dark:border-dark-border">
                {notes && notes.length > 0 ? (
                    <div className="divide-y divide-dark-border dark:divide-dark-secondary">
                        {notes
                            .slice()
                            .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
                            .map((note) => (
                                <div
                                    key={note._id}
                                    className=" p-4 flex items-start justify-between transition-colors duration-300">
                                    <div className="flex-1">
                                        <p className="font-medium mb-1 ">
                                            {note.content}
                                        </p>
                                        <span className="text-sm text-dark-border/80">
                                            {formatDateWithTime(note.createdAt)}
                                        </span>
                                    </div>
                                    <button
                                        onClick={() => handleDeleteNote(note._id)}
                                        className=" ml-4 text-dark-danger hover:text-dark-danger/80 transition-colors duration-300 p-2 rounded-full hover:bg-dark-danger/10 dark:hover:bg-dark-danger/20">
                                        <MdDelete />
                                    </button>
                                </div>
                            ))
                        }
                    </div>
                ) : (
                    <div className="md:h-[360px] flex flex-col justify-center items-center p-8 text-center">
                        <MdNoteAlt className="text-6xl mb-4" />
                        <p className="text-lg font-medium">
                            No notes for this transaction yet
                        </p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default Notes;