import { useClient } from '@/contexts/ClientContext';
import { useState, useEffect } from 'react';

import Container from '../../Menu/Container';
import Item from '../../Menu/Item';
import Content from '../../Menu/Content';

import Home from '@/components/icons/Home';
import User from '@/components/icons/User';
import Instances from '@/components/icons/Instances';
import Code from '@/components/icons/Code';

import Selector from './Selector';
import Limitter from './Limitter';
import Redeemer from './Redeemer';
import { toast } from 'react-toastify';

interface SettingsProps {
    className: string;
}

export default function Settings({
    className
}: SettingsProps) {
    const { client, ready } = useClient();

    const [topMost, setTopMost] = useState(false);

    const [paused, setPaused] = useState(false);

    const [product, setProduct] = useState<'premium' | 'freemium' | 'none'>('none');

    const [expiration, setExpiration] = useState<Date | null>(null);

    const [cpuLimit, setCpuLimit] = useState(100);

    const [memoryLimit, setMemoryLimit] = useState(512);

    const [availableMemory, setAvailableMemory] = useState(0.00);

    const handleRedeem = (license: string) => {
        if (!client || !ready)
            return;

        client.user.redeem(license);
    }

    const handleFreemium = () => {
        if (!client || !ready)
            return;

        client.user.freemium();
    }

    const handleCpuLimit = (value: number) => {
        if (!client || !ready)
            return;

        client.configuration.setCpuMax(value);
    }

    const handleRamLimit = (value: number) => {
        if (!client || !ready)
            return;

        client.configuration.setRamMax(Number(value) || 1024);
    }

    useEffect(() => {
        if (!client || !ready)
            return;

        const handleProduct = (user: any) => {
            const { products } = user;

            if (!products || !products.length)
                return;

            const product = products.find((product: any) => product.product === 'premium-wave') || products.find((product: any) => product.product === 'freemium-wave');
        
            if (!product)
                return;
            
            const expiration = new Date(product.expiration);
        
            setProduct(product.product.replace('-wave', '') as 'premium' | 'freemium');

            setExpiration(expiration);
            toast.success('Loaded user products!');
        }

        const handleConfiguration = ({ data }: any) => {
            const configuration = data.configuration;

            const topMost = configuration.general.topMost;
            
            const cpuMax = configuration.instance.cpu.max;

            const memoryMax = configuration.instance.memory.max;

            setTopMost(topMost);

            setCpuLimit(cpuMax);

            setMemoryLimit(memoryMax);
        }
        
        const handleAvailableMemory = (data: any) => {  
            setAvailableMemory(data.data.toFixed(0));
        }

        const listeners = [
            client.user.on('login', handleProduct),
            client.user.on('redeem-license', handleProduct),
            client.configuration.on('initialized', handleConfiguration),
            client.configuration.on('available-memory', handleAvailableMemory)
        ];
    
        client.configuration.initialize();

        return () => {
            listeners.forEach(listener => client.configuration.off(listener));
        };
    }, [client, ready]);

    return (
        <Container className={className}>
            <Container.Left title='Settings'>
                <Item header='Account'>
                    <User />
                </Item>
                <Item header='Instance'>
                    <Instances />
                </Item>
            </Container.Left>
            <Container.Right>
                <Content>
                    <Content.Header title='Account'/>
                    <Content.Frame>
                        <Redeemer product={product} expiration={expiration} onRedeem={handleRedeem} onFreemium={handleFreemium}/>
                    </Content.Frame>
                </Content>
                <Content>
                    <Content.Header title='Instance'/>
                    <Content.Frame>
                        <Limitter min={1} max={100} value={cpuLimit} unit='%' onChange={handleCpuLimit}>
                            <Limitter.Title>
                                CPU Usage Limit
                            </Limitter.Title>
                            <Limitter.Description>
                                <span>
                                    This helps in preventing the process from consuming excessive CPU resources, ensuring that the system remains responsive and other tasks can execute efficiently.
                                </span>
                                <br/>
                                <span>
                                    Leaving this field empty will result in no restrictions on CPU usage.
                                </span>
                            </Limitter.Description>
                        </Limitter>
                        <Limitter min={512} max={availableMemory} value={memoryLimit} unit='MB' onChange={handleRamLimit}>
                            <Limitter.Title> 
                                Ram Usage Limit&nbsp;
                                <span style={{ color: '#AC9090' }}>
                                    (Severe Performance Loss)
                                </span> 
                            </Limitter.Title>
                            <Limitter.Description>
                                <span>
                                    This helps in preventing the process from consuming excessive CPU resources, ensuring that the system remains responsive and other tasks can execute efficiently.
                                </span>
                                <br/>
                                <span style={{ color: '#AC9090' }}>
                                    However, adding a limit may result in performance loss and issues that could cause the application to crash due to insufficient resources.
                                </span>
                            </Limitter.Description>
                        </Limitter>
                    </Content.Frame>
                </Content>
            </Container.Right>
        </Container>
    );
}   