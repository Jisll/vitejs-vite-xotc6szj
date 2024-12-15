import { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '@/store';
import { toggle } from '@/store/reducer/client';

import Container from '../../Menu/Container';
import Item from '../../Menu/Item';
import Content from '../../Menu/Content';

import Managed from '@/components/icons/Managed';
import Card from './Card';

interface ClientsProps {
    className: string;
}

export default function Clients({
    className
}: ClientsProps) {
    const [selectedIndex, setSelectedIndex] = useState(0);

    const dispatch = useDispatch();

    const clients = useSelector((state: RootState) => state.client.clients);

    const handleTabChange = (index: number) => {
        if (index === selectedIndex)
            return;

        setSelectedIndex(index);
    }

    return (
        <Container className={className}>
            <Container.Left title='Client Manager'>
                <Item header='Managed'>
                    <Managed stroke='currentColor'/>
                </Item>
            </Container.Left>
            <Container.Right>
                <Content>
                    <Content.Header title='Managed'/>
                    <Content.Frame>
                    {
                            Object.keys(clients).map((key, index) => {
                                const item = clients[key];

                                if (!item)
                                    return null;

                                const client = item.client;

                                const handleToggle = () => {
                                    dispatch(toggle(client.process.id));
                                }

                                return (
                                    <Card key={key} id={client.player.id} name={client.player.name} game={client.game.name} selected={item.selected} onCheck={handleToggle}/>
                                );
                            })
                        }
                    </Content.Frame>
                </Content>
            </Container.Right>
        </Container>
    );
}   