import React, { Fragment, useContext, useEffect, useState } from 'react';
import { connect } from "react-redux";
import io from 'socket.io-client';

const ioServer = 'http://52.53.200.228:3080';

const SocketContext = React.createContext();

export function useSocket() {
    return useContext(SocketContext);
}

const SocketProvider = ({ userid, children }) => {
    const [socket, setSocket] = useState();

    useEffect(() => {
        if (userid === null)
            return;

        const newSocket = io(
            ioServer,
            {
                query: {
                    id: userid
                }
            }
        )

        setSocket(newSocket);

        return () => newSocket.close();


    }, [userid])

    return (
        <SocketContext.Provider value={socket}>
            {children}
        </SocketContext.Provider>
    )
}

const mapStateToProps = (state) => ({
    userid: state.auth.id,
});


export default connect(mapStateToProps)(SocketProvider);