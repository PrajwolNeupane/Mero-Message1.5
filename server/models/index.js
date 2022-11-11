import mongoose from 'mongoose';
import 'dotenv/config';

export default mongoose.connect(`mongodb+srv://${"PrajwolNeupane"}:${encodeURIComponent("s@fn39tb")}@cluster0.sijwmdc.mongodb.net/MeroMessage?retryWrites=true&w=majority`).then(() => {
    console.log(`Database connected`);
}).catch((e) => {
    console.log(`${e}`);
})