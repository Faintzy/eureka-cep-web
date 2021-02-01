import React, { useState } from 'react';
import { Input, Modal, Button } from "antd";
import './global.css';

function Main() {

    const [cep, setCep] = useState("0");
    const [address, setAddress] = useState({});
    const [isModalVisible, setIsModalVisible] = useState(false);
    const [loading, setLoading] = useState(false);
    const [btnValue, setBtnValue] = useState("Consultar");

    const showModal = () => {
        setIsModalVisible(true);
    }
    
    const handleOk = () => {
        setIsModalVisible(false);
        setAddress({});
    }
    
    const handleCancel = () => {
        setIsModalVisible(false);
        setAddress({});
    }

    const capitalize = (string) => string.charAt(0).toUpperCase() + string.slice(1).toLowerCase();

    const getAddress = async () => {
        var response = await fetch(`http://localhost:3030/cep/${cep}`);

        if (response.status == 404) {
            setAddress({
                'Ocorreu um erro': "CEP Inválido"
            });

            return;
        }

        var responseJson = await response.json();

        if (responseJson.success == false) {
            setAddress({
                'Ocorreu um erro': responseJson.msg
            });

            return;
        }
        var addr = responseJson.msg;
        setAddress(JSON.parse(addr));
    }

    return (
        <>
        <div className="main">
            <h1 className="title">Eureka CEP</h1>

            <Input 
                onFocus={(e) => e.target.placeholder = ""}
                onBlur={(e) => e.target.placeholder = "Insira o CEP"}
                onChange={(e) => setCep(e.target.value)}
                placeholder="Insira o CEP"
            />
            
            <br />

            <Button 
                className="btn"
                loading={loading}
                onClick={(e) => {
                    getAddress();
                    setBtnValue("Consultando..");
                    setLoading(true);
                    setTimeout(() => {
                        showModal(); 
                        setLoading(false);
                        setBtnValue("Consultar");

                    }, 2000);
                }}
            >
                {btnValue}
            </Button>
        </div>

        <Modal 
            title="Endereço" 
            visible={isModalVisible} 
            onOk={handleOk} 
            onCancel={handleCancel}
            cancelText="Fechar"
        >
            {
                Object.keys(address).map((key) => {
                    return <li key={key}>{capitalize(key)}: {address[key]}</li>
                })
            }
        </Modal>
        </>
    );
}

export default Main;