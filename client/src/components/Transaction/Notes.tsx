import React from "react";
import { formatDateWithTime } from "../../helpers/formatDate";

interface INote {
    content: string;
    createdAt: string;
}

interface INotesProps {
    notes: INote[];
}

const Notes: React.FC<INotesProps> = ({ notes }) => {
    return (
        <div className="w-full px-4">
            <div className="dark:bg-dark-background2 rounded-lg p-6 space-y-4">
                {notes
                    .slice()
                    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
                    .map((note, index) => (
                        <div key={index} className="bg-light-secondary dark:bg-dark-background3 p-4 rounded-lg shadow-sm">
                            <p className="text-lg font-medium">{note.content}</p>
                            <span className="text-sm">{formatDateWithTime(note.createdAt)}</span>
                        </div>
                    ))}
            </div>
        </div>
    );
};

export default Notes;
