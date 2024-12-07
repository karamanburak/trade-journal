import toastNotify from "../utils/toastNotify";
import { axiosWithPublic } from "./useAxios";
import { handleAxiosError } from "./handleAxiosError";

const useNoteCall = () => {

    const getNotes = async (): Promise<ITrade[]> => {
        try {
            const { data } = await axiosWithPublic("/notes");
            // console.log(data.data);
            return data.data;
        } catch (error) {
            console.log("Error getting notes:", error);
            handleAxiosError(error)
            return []
        }
    };

    const postNote = async (tradeId: string, userId: string, noteContent: string): Promise<void> => {
        try {
            const { data } = await axiosWithPublic.post(`/notes`, {
                content: noteContent,
                tradeId: tradeId,
                userId: userId
            });
            toastNotify("success", data.message);
        } catch (error) {
            console.log("Error posting note:", error);
        }
    }

    const deleteNote = async (noteId: string): Promise<void> => {
        try {
            const { data } = await axiosWithPublic.delete(`notes/${noteId}`);
            toastNotify("success", data.message);
        } catch (error) {
            console.log("Error deleting trade:", error);
        }
    };


    return {
        getNotes,
        postNote,
        deleteNote
    };
};

export default useNoteCall;
