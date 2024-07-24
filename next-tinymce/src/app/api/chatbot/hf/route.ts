"use server";
import { HfInference } from '@huggingface/inference';
import { NextResponse } from 'next/server';


export async function POST(request: Request) {
    const { documentContent, question } = await request.json();
    
    console.log("HF_API_KEY", process.env.HF_API_KEY);
    const hf = new HfInference(process.env.HF_API_KEY || '');

    try {
        if (!question) {
            return NextResponse.json({ error: 'No question provided' }, { status: 400 });
        }

        const inputText = `Context: ${documentContent}\n\nQuestion: ${question} \n\nAnswer:`;
        const messages = [
            {
                role: 'system',
                content: documentContent,
            },
            {
                role: 'user',
                content: question,
            },
        ];
        // type InputObj = {
        //     context: string;
        //     question: string;
        // }
        // const inputObj: InputObj = {"context": documentContent, question};
        // console.log("inputObj", inputObj);
        // const result = await hf.questionAnswering({
        //     model: 'deepset/roberta-base-squad2',
        //     inputs: inputObj,
        // });
        const result2 = await hf.textGeneration({
            // model: 'mistralai/Mistral-7B-Instruct-v0.3',
            // inputs: JSON.stringify(messages),
            model: 'mistralai/Mistral-7B-Instruct-v0.3',
            inputs: inputText,
        });
        console.log("result", result2);

        // if (result && result.answer) {
        //     return NextResponse.json({ answer: result.answer}, { status: 200 });
        // }
        if (result2 && result2.generated_text) {
            const lines = result2.generated_text.split('Answer:');
            const answer = lines[lines.length - 1].trim();
            return NextResponse.json({ answer: answer}, { status: 200 });
        } 
        else {
            return NextResponse.json({ error: 'Failed to get a response from the model' }, { status: 500 });
        }
    } catch (error: any) {
        return NextResponse.json({ error: `Error occurred during query: ${error.message}` }, { status: 500 });
    }
}