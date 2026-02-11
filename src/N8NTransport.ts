import type {
    ChatTransport,
    UIMessageChunk,

} from "ai";
const BASE_URL = "https://content.kongbot.net/webhook/ai-editor";

export class N8NTransport implements ChatTransport<any> {
    constructor(private editor: any) { }

    async sendMessages({ messages }: any) {
        const last = messages.at(-1);

        const selected =
            last?.metadata?.documentState?.selectedBlocks?.[0]?.block ?? [];

        // const selectedText = selected
        //     .map((b: any) =>
        //         b.block.content?.map((c: any) => c.text).join("")
        //     )
        //     .join("\n");

        const fullHTML = await this.editor.blocksToFullHTML(
            this.editor.document
        );

        const res = await fetch(BASE_URL, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                selected_text: selected,
                full_content: fullHTML,
                action: last?.parts?.[0]?.text,
            }),
        });

        const data = await res.json();

        const text = data.text;
        const id = crypto.randomUUID();
        const stream = new ReadableStream<UIMessageChunk>({
            start(controller) {
                controller.enqueue({
                    type: "text-start",
                    id: id,
                });

                controller.enqueue({
                    type: "text-delta",
                    delta: text,
                    id: id,
                });

                controller.enqueue({
                    type: "text-end",
                    id: id,
                });

                controller.close();
            },
        });

        return stream;
    }

    async reconnectToStream() {
        return null;
    }
}
