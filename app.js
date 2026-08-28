/*******************************************************************************************************************************************
 * Objetivo: Arquivo responsável pela API do projeto IoT (Controle de LED via MQTT)
 * Data: 28/08/2026
 * Autor: Jean Costa
 * Versão 1.0
 ********************************************************************************************************************************************/

const express = require('express')
const cors = require('cors')
const mqtt = require('mqtt')

const app = express()

const corsOptions = {
    origin: "*",
    methods: "GET, POST, PUT, DELETE, OPTIONS", 
    allowedHeaders: ["Content-Type", "Authorization"], 
    credentials: true 
}

// Middlewares globais (tratam CORS e JSON para todas as rotas)
app.use(cors(corsOptions))
app.use(express.json())

// Configuração do Broker MQTT (mesmos dados configurados no ESP32)
const BROKER_MQTT = 'mqtt://broker.hivemq.com'
const TOPIC = 'senaijandira/sala/manha/32'
const mqttClient = mqtt.connect(BROKER_MQTT)

mqttClient.on('connect', () => {
    console.log('API conectada ao Broker HiveMQ com sucesso!')
})

// Rota POST para acionamento do LED
app.post('/v1/iot/led', (request, response) => {
    const dadosBody = request.body
    
    if(dadosBody.comando == 'ligar'){

        mqttClient.publish(TOPIC, 'ligar', (error) => {
            if(error){
                response.status(500)
                response.json({ 
                    status: false, 
                    mensagem: 'Falha ao acionar o LED via MQTT!' 
                })
            }else{
                response.status(200)
                response.json({ 
                    status: true, 
                    mensagem: 'LED acionado com sucesso via MQTT!' 
                })
            }
        })
    }else if(dadosBody.comando == 'desligar'){
        mqttClient.publish(TOPIC, 'desligar', (error) => {
            if(error){
                response.status(500)
                response.json({ 
                    status: false, 
                    mensagem: 'Falha ao acionar o LED via MQTT!' 
                })
            }else{
                response.status(200)
                response.json({ 
                    status: true, 
                    mensagem: 'LED desligado com sucesso via MQTT!' 
                })
            }
        })
    }
})

// Inicialização do servidor
const PORT = 3000
app.listen(PORT, () => {
    console.log(`Servidor rodando na porta ${PORT}: http://localhost:${PORT}`)
})