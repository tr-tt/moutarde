const dotenv = require('dotenv')
const readline = require('readline')
const {Client} = require('pg')
const path = require('path')

dotenv.config(
    {
        path: path.resolve(`.env.${process.env.NODE_ENV}`)
    }
)

let _id = 0

const userInput = readline.createInterface(
    {
        input: process.stdin,
        output: process.stdout
    }
)

userInput.question(
    'ID image (integer) = ',
    (id) =>
    {
        _id = id || 0

        userInput.close()

        const _client = new Client(
            {
                host: process.env.POSTGRES_HOST,
                port: process.env.POSTGRES_PORT,
                user: process.env.POSTGRES_USER,
                password: process.env.POSTGRES_PASSWORD,
                database: process.env.POSTGRES_DATABASE
            }
        )
        
        const _query = 
        {
            name: 'get_image',
            text: 'SELECT name, blob FROM "Images" where id = $1',
            values: [_id]
        }
        
        _client
            .connect()
            .then(
                () =>
                {
                    console.log('[INFO] connected to postgresql')
                }
            )
            .then(
                () =>
                {
                    return _client.query(_query)
                }
            )
            .then(
                (result) =>
                {
                    if(result.rowCount == 1)
                    {
                        const {name, blob} = result.rows[0]

                        if(blob)
                        {
                            const fs = require('fs')
            
                            fs.writeFileSync(`/tmp/${name}`, blob, 'binary')
        
                            console.log(`[INFO] Image exported to /tmp/${name}`)
                        }
                        else
                        {
                            console.error(`[ERROR] Image id ${_id} buffer is empty`)
                        }
                    }
                    else
                    {
                        console.error(`[ERROR] No image found with id ${_id}`)
                    }                   
                }
            )
            .catch(
                (exception) =>
                {
                    console.error('[ERROR]', exception)
                }
            )
            .finally(
                () =>
                {
                    _client.end()
        
                    console.log('[INFO] disconnected from postgresql')
                }
            )
    }
)