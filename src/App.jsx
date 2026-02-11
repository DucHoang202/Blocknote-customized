
import { BlockNoteEditor } from "@blocknote/core";
import { filterSuggestionItems } from "@blocknote/core/extensions";
import "@blocknote/core/fonts/inter.css";
import { en } from "@blocknote/core/locales";
import { BlockNoteView } from "@blocknote/mantine";
import "@blocknote/mantine/style.css";
import styles from "../styles/Notion.module.scss";
import { SlashMenuExtension } from "@blocknote/core";
import "@blocknote/mantine/style.css";
import {
  DefaultReactSuggestionItem,
  getDefaultReactSlashMenuItems,
  SuggestionMenuController,
} from "@blocknote/react";
import { HiOutlineGlobeAlt } from "react-icons/hi";
import {
  insertOrUpdateBlockForSlashMenu,
} from "@blocknote/core/extensions";
import { aiSlashItem } from "./components/aiSlashItem"; //  function thường, không phải hook

import {
  AIExtension,
  AIMenuController,
  AIToolbarButton,
  getAISlashMenuItems,
  AIMenu,
  getDefaultAIMenuItems,
  aiDocumentFormats,

} from "@blocknote/xl-ai";
import {
  ComponentsContext,
  defaultComponents,
} from "@blocknote/react";
import { en as aiEn } from "@blocknote/xl-ai/locales";
import "@blocknote/xl-ai/style.css";
import { DefaultChatTransport } from "ai";
import { useEffect, useRef } from "react";
import {
  BasicTextStyleButton,
  BlockTypeSelect,
  ColorStyleButton,
  CreateLinkButton,
  FileCaptionButton,
  FileReplaceButton,
  FormattingToolbar,
  FormattingToolbarController,
  NestBlockButton,
  TextAlignButton,
  UnnestBlockButton,
  useCreateBlockNote,
} from "@blocknote/react";
import { BlueButton } from "./components/BlueButton";
import { useAIState } from "./components/aiState";

import { streamText } from "ai";

function AIRegistrar() {
  const setOpenPanelAtSelection = useAIState(s => s.setOpenPanelAtSelection);

  // lấy hàm openPanel THẬT từ BlueButton qua custom event
  useEffect(() => {
    window.__registerOpenAI = (fn) => {
      setOpenPanelAtSelection(() => fn);
    };
  }, []);

  return null;
}


export async function POST(req) {
  const { messages } = await req.json();

  const first = messages[0];

  const selected_text =
    first.metadata.documentState.selectedBlocks?.[0]?.block?.content?.[0]
      ?.text || "";

  const full_context = first.metadata.documentState.fullHTML;

  const last = messages[messages.length - 1].content.toLowerCase();

  let action = "rewrite";
  if (last.includes("improve")) action = "improve";
  if (last.includes("shorten")) action = "shorten";
  if (last.includes("expand")) action = "expand";

  // 🔥 gọi n8n ở đây
  const res = await fetch("https://content.kongbot.net/webhook/ai-editor", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      action,
      selected_text,
      full_context,
      language: "vi",
    }),
  });

  const data = await res.json();

  // 🔥 stream về cho BlockNote
  return new Response(
    streamText({
      model: {
        doStream: async function* () {
          yield {
            type: "text-delta",
            text: data.result_html,
          };
        },
      },
    }).toReadableStream()
  );
}
function AIIcon() {
  return (
    <svg
      width="16"
      height="16"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M12 3l1.8 4.5L18 9l-4.2 1.5L12 15l-1.8-4.5L6 9l4.2-1.5L12 3z" />
      <path d="M5 16l.8 2L8 19l-2.2.8L5 22l-.8-2L2 19l2.2-.8L5 16z" />
    </svg>
  );
}
function getActiveEditor() {
  return window.__blocknote_editor;
}


export const makeInformal = (
  editor
) => ({
  key: "make_informal",
  title: "Make Informal",
  aliases: ["informal", "make informal", "casual"],
  onItemClick: async () => {
    await editor.getExtension(AIExtension)?.invokeAI({
      // The prompt to send to the LLM:
      userPrompt: "Give the selected text a more informal (casual) tone",
      // Tell the LLM to specifically use the selected content as context (instead of the whole document)
      useSelection: true,
      // We only want the LLM to update selected text, not to add / delete blocks
      streamToolsProvider: aiDocumentFormats.html.getStreamToolsProvider({
        defaultStreamTools: {
          add: false,
          delete: false,
          update: true,
        },
      }),
    });
  },
  size: "small",
});

function CustomAIMenu() {
  return (
    <AIMenu
      items={(
        editor,
        aiResponseStatus

      ) => {
        if (aiResponseStatus === "user-input") {
          if (editor.getSelection()) {
            // When a selection is active (so when the AI Menu is opened via the Formatting Toolbar),
            // we add our `makeInformal` command to the default items.
            return [
              //...getDefaultAIMenuItems(editor, aiResponseStatus),
              makeInformal(editor),
            ];
          } else {
            //return getDefaultAIMenuItems(editor, aiResponseStatus);
            return [];
          }
        }

        // for other states, return the default items
        //return getDefaultAIMenuItems(editor, aiResponseStatus);
        return [];
      }}
    />
  );
}
// ========== UI ==========
function FormattingToolbarWithAI() {
  return (
    <FormattingToolbarController
      formattingToolbar={() => (
        <FormattingToolbar>
          {...getFormattingToolbarItems()}
          <AIToolbarButton />
        </FormattingToolbar>
      )}
    />
  );
}

function SuggestionMenuWithAI(props) {
  return (
    <SuggestionMenuController
      triggerCharacter="/"
      getItems={async (query) =>
        filterSuggestionItems(
          [
            ...getDefaultReactSlashMenuItems(props.editor),
            ...getAISlashMenuItems(props.editor),
          ],
          query
        )
      }
    />
  );
}


// 🔥 Debug mọi request BlockNote AI gửi đi
(function interceptFetch() {
  const originalFetch = window.fetch;

  window.fetch = async (...args) => {
    const [url, options] = args;

    // Chỉ log request tới AI server của bạn
    if (typeof url === "string" && url.includes("/webhook/ai-editor")) {
      console.group("🧠 BlockNote AI Request");
      console.log("URL:", url);

      if (options?.body) {
        try {
          const parsed = JSON.parse(options.body);
          console.log("Payload JSON:", parsed);
        } catch {
          console.log("Raw body:", options.body);
        }
      }

      console.log("Options:", options);
      console.groupEnd();
    }

    const res = await originalFetch(...args);

    // Log luôn response trả về cho BlockNote
    if (typeof url === "string" && url.includes("/webhook/ai-editor")) {
      const clone = res.clone();
      try {
        const text = await clone.text();
        console.group("🧠 BlockNote AI Response");
        console.log(text);
        console.groupEnd();
      } catch { }
    }

    return res;
  };
})();

const myDocumentStateBuilder = async (aiRequest) => {
  const editor = aiRequest.editor;

  const selection = editor.getTextCursorPosition();
  const currentBlock = selection.block;

  return {
    selection: true,
    selectedBlocks: [
      {
        id: currentBlock.id,
        block: currentBlock, // ✅ Block object
      },
    ],
    blocks: editor.document.map((block) => ({
      block, // ✅ Full document blocks
    })),
    isEmptyDocument: editor.document.length === 0,
  };
};

import {
  createUIMessageStreamResponse,
  createUIMessageStream,
} from "ai";


export function insertRelativeToSelection(
  editor,
  blocks,
  position
) {
  const selected = editor.getTextCursorPosition()?.block;

  // Nếu không có block được chọn → chèn cuối document
  if (!selected) {
    editor.insertBlocks(blocks, undefined, "after");
    return;
  }

  // Chèn so với block đang chọn
  editor.insertBlocks(blocks, selected.id, position);
}


export default function App({ articleId, content }) {
  const editor = useCreateBlockNote();

  // editor sẵn sàng — truyền thẳng vào aiSlashItem(editor) bên dưới, không cần hook

  useEffect(() => {
    window.__blocknote_editor = editor;
  }, [editor]);

  useEffect(() => {
    window.loadHTMLToEditor = async (html) => {
      const blocks = await editor.tryParseHTMLToBlocks(html);
      editor.replaceBlocks(editor.document, blocks);
    };
    window.__EDITOR_READY__ = true;
  }, [editor]);

  useEffect(() => {
    let timeout;
    const unsubscribe = editor.onChange(() => {
      clearTimeout(timeout);
      timeout = setTimeout(async () => {
        const html = await editor.blocksToFullHTML(editor.document);
        let charCount = 0;
        let wordCount = 0;
        for (const block of editor.document) {
          if (!block.content) continue;
          for (const item of block.content) {
            if (item.type === "text") {
              const text = item.text || "";
              charCount += text.length;
              wordCount += text.trim().split(/\s+/).filter(Boolean).length;
            }
          }
        }
        window.saveToCMS({
          articleId,
          content: html,
          stats: { blocks: editor.document.length, characters: charCount, words: wordCount },
        });
      }, 1000);
    });
    return () => unsubscribe();
  }, [editor, articleId]);

  return (
    <BlockNoteView editor={editor} formattingToolbar={false} suggestionMenu={false}>
      <FormattingToolbarController
        formattingToolbar={() => (
          <FormattingToolbar>
            <BlockTypeSelect key={"blockTypeSelect"} />
            <BlueButton key={"customButton"} />
            <FileCaptionButton key={"fileCaptionButton"} />
            <FileReplaceButton key={"replaceFileButton"} />
            <BasicTextStyleButton basicTextStyle={"bold"} key={"boldStyleButton"} />
            <BasicTextStyleButton basicTextStyle={"italic"} key={"italicStyleButton"} />
            <BasicTextStyleButton basicTextStyle={"underline"} key={"underlineStyleButton"} />
            <BasicTextStyleButton basicTextStyle={"strike"} key={"strikeStyleButton"} />
            <BasicTextStyleButton basicTextStyle={"code"} key={"codeStyleButton"} />
            <TextAlignButton textAlignment={"left"} key={"textAlignLeftButton"} />
            <TextAlignButton textAlignment={"center"} key={"textAlignCenterButton"} />
            <TextAlignButton textAlignment={"right"} key={"textAlignRightButton"} />
            <ColorStyleButton key={"colorStyleButton"} />
            <NestBlockButton key={"nestBlockButton"} />
            <UnnestBlockButton key={"unnestBlockButton"} />
            <CreateLinkButton key={"createLinkButton"} />
          </FormattingToolbar>
        )}
      />

      {/* ✅ aiSlashItem(editor) — gọi function bình thường, editor đến từ useCreateBlockNote() */}
      <SuggestionMenuController
        triggerCharacter="/"
        getItems={async (query) =>
          filterSuggestionItems(
            [...getDefaultReactSlashMenuItems(editor), aiSlashItem(editor)],
            query
          )
        }
      />
    </BlockNoteView>
  );
}
