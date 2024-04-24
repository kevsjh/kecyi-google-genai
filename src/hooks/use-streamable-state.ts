'use client'

import { useState } from "react";
import { StreamableValue, readStreamableValue } from "ai/rsc";

export const useStreamableState = <T,>(initialState: T) => {
    const [state, setState] = useState<T>(initialState);
    const updateState = async (streamable: Promise<StreamableValue<T>>, stateupdate: Partial<T> = {}) => {
        setState(old => ({ ...old, ...stateupdate }));
        for await (const v of readStreamableValue(await streamable)) {
            setState(old => ({ ...old, ...v }));
        }
    }
    return [state, updateState] as [T, typeof updateState];
}