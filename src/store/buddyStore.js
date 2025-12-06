import { create } from 'zustand';
import { generateRoomCode } from '@utils/codeGenerator';

export const useBuddyStore = create((set) => ({
    roomCode: null,
    isHost: false,
    participants: [],

    createRoom: () => {
        const code = generateRoomCode();
        set({
            roomCode: code,
            isHost: true,
            participants: []
        });
        return code;
    },

    joinRoom: (code) => set({
        roomCode: code,
        isHost: false
    }),

    addParticipant: (participant) => set((state) => ({
        participants: [...state.participants, {
            ...participant,
            id: participant.id || Date.now(),
            joinedAt: new Date().toISOString(),
        }]
    })),

    updateParticipant: (id, data) => set((state) => ({
        participants: state.participants.map(p =>
            p.id === id ? { ...p, ...data } : p
        )
    })),

    removeParticipant: (id) => set((state) => ({
        participants: state.participants.filter(p => p.id !== id)
    })),

    leaveRoom: () => set({
        roomCode: null,
        isHost: false,
        participants: []
    }),
}));

