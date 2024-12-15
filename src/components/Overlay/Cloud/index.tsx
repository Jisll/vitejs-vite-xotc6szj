import { useRef, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '@/store';
import { fetchAsync, searchAsync, resolveAsset } from '@/api/scriptBlox';
import { set } from '@/store/reducer/cloud';

import Container from '../../Menu/Container';
import Item from '../../Menu/Item';
import Content from '../../Menu/Content';

import { toast } from 'react-toastify';
import SemiCode from '@/components/icons/SemiCode';
import Search from '@/components/icons/Search';
import Card from './Card';

import styles from '@/styles/overlay.module.css';

interface CloudProps {
    className: string;
}

export default function Cloud({
    className
}: CloudProps) {
    const elementRef = useRef<HTMLInputElement>(null);

    const [selectedIndex, setSelectedIndex] = useState(0);

    const dispatch = useDispatch();

    const cloud = useSelector((state: RootState) => state.cloud.result.scripts);

    const handleTabChange = (index: number) => {
        if (index === selectedIndex)
            return;

        setSelectedIndex(index);
    }

    const handleKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
        if (event.key !== 'Enter')
            return;

        handleSearch();
    }

    const handleSearch = () => {
        if (!elementRef.current)
            return;

        const value = elementRef.current.value;

        if (value === '')
            fetchAsync(1)
                .then(data => {
                    dispatch(
                        set(
                            data.result
                        )
                    )
                })
                .catch(() => toast.error("Couldn't retrieve the script database from our servers."));
        else {
            searchAsync(value, 1)
                .then(data => {
                    dispatch(
                        set(
                            data.result
                        )
                    )
                })
                .catch(() => toast.error("Couldn't retrieve the script database from our servers."));
        }
    }

    return (
        <Container className={className}>
            <Container.Left title='Script Cloud'>
                <Item header='ScriptBlox'>
                    <SemiCode fill='currentColor'/>
                </Item>
            </Container.Left>
            <Container.Right>
                <Content>
                    <Content.Header title='ScriptBlox'>
                        <div className={styles.search}>
                            <input ref={elementRef} type='text' placeholder='Search Scripts...' onKeyDown={handleKeyDown}/>
                            <div 
                                onClick={handleSearch}
                                style={{
                                    display: 'flex'
                                }}>
                                <Search className={styles.icon}/>
                            </div>
                        </div>
                    </Content.Header>
                    <Content.Frame>
                        {
                            cloud.map(({ slug, title, game, scriptType }, index) => (
                                <Card key={index} slug={slug} title={title} game={game.name} type={scriptType} image={resolveAsset(game.imageUrl)}/>
                            ))
                        }
                    </Content.Frame>
                </Content>
            </Container.Right>
        </Container>
    );
}  