import { useClient } from '@/contexts/ClientContext';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '@/store';
import { useRef, useEffect } from 'react';
import { Overlay, setOverlay } from '@/store/reducer/context';
import { toast } from 'react-toastify';

import styles from '@/styles/login.module.css';

export default function Login({
    visible
}: {
    visible: boolean;
}) {
    const { client, ready } = useClient();

    const dispatch = useDispatch();

    const username = useRef<HTMLInputElement>(null);

    const password = useRef<HTMLInputElement>(null);

    const overlay = useSelector((state: RootState) => state.context.overlay);

    const handleForgotPassword = () => {
        if (!client || !ready)
            return;

        if (!username.current)
            return;

        client.user.forgotPassword(username.current.value);
    }

    const handleLogin = () => {
        if (!client || !ready)
            return;

        if (!username.current || !password.current)
            return;

        client.user.login(username.current.value, password.current.value);  
    }

    const handleRegister = () => {
        dispatch(setOverlay(Overlay.Register));
    }

    useEffect(() => {
        if (!client || !ready)
            return;

        const listeners = [
            client.user.on('login', token => {
                dispatch(setOverlay(Overlay.None));
            }),
            client.user.on('forgot-password', () => {
                toast.success('Password reset instructions have been sent to your email.');
            }),
            client.user.on('logout', () => {
                dispatch(setOverlay(Overlay.Login));
            }),
            client.user.on('api-error', (data) => {
                if (overlay === Overlay.None)
                    dispatch(setOverlay(Overlay.Login));

                toast.error(data.message);
            }),
            client.user.on('api-success', (data) => {
                toast.success(data.message);
            }),
        ];

        client.user.tryLogin();

        return () => {
            listeners.forEach((key) => {
                client.user.off(key);
            });
        }
    }, [client, ready]);

    return (
        <div className={`${styles.container} ${visible ? styles.active : ''}`}>
            <div className={styles.title}>
                Login
            </div>
            <div className={styles.description}>
                Welcome Back!
            </div>
            <div className={styles.separator}></div>
            <div className={styles.input}>
                <div className={styles.name}>
                    Username / E-Mail
                </div>
                <input ref={username} type='text' placeholder='admin' />
            </div>
            <div className={styles.input}>
                <div className={styles.name}>
                    Password
                </div>
                <input ref={password} type='password' placeholder='********' />
            </div>
            <div className={styles.group}>
                <div></div>
                <div className={styles.link} onClick={handleForgotPassword}>
                    Reset Password
                </div>
            </div>
            <div className={styles.separator}></div>
            <div className={styles.button} onClick={handleLogin}>
                Sign In
            </div>
            <div className={styles.bottom}>
                <div>
                    <span>
                        <span>
                            Don’t have an account?&nbsp;
                        </span>
                        <span className={styles.blue} onClick={handleRegister}>
                            Sign Up
                        </span>
                    </span>
                </div>
            </div>
        </div>
    );
}