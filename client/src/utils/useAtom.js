import { useEffect, useState } from "react";

export function useAtom(fetcher, inputs) {
    const [state, setState] = useState({ status: 'loading' })

    useEffect(() => {
        if (state.status !== 'loading') {
            setState({ status: 'loading' })
        }

        fetcher(inputs)
            .then(value => setState({ status: 'ready', value }))
            .catch(error => setState({ status: 'aborted', error }))
    }, [inputs])

    return state
}