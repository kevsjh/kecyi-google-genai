import { type ClassValue, clsx } from "clsx"
import { ReadonlyURLSearchParams } from "next/navigation";
import prettyBytes from "pretty-bytes";
import { twMerge } from "tailwind-merge"
import { customAlphabet } from 'nanoid'
import { getMimeType } from "./get-mime-type";
import { randomBytes } from "crypto";
import { Message } from "./chat/stock-agent-ai-actions";
import { AgentChatTypeEnum } from "@/constant/enum";



export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export const nanoid = customAlphabet(
  '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz',
  7
) // 7-character random string

export const sleep = (ms: number) =>
  new Promise(resolve => setTimeout(resolve, ms))

export const createUrl = (pathname: string, params: URLSearchParams | ReadonlyURLSearchParams) => {
  const paramsString = params.toString();
  const queryString = `${paramsString.length ? '?' : ''}${paramsString}`;

  return `${pathname}${queryString}`;
};

export function isValidUrl(url: string) {

  const delimiters = [' ', ',', ';']; // Add more delimiters if needed
  const hasMultipleUrls = delimiters.some(delimiter => url.includes(delimiter));

  if (hasMultipleUrls) {
    return false;
  }
  try {
    // eslint-disable-next-line no-new
    const parsedUrl = new URL(url);
    return parsedUrl.protocol !== null && parsedUrl.hostname !== null;
  } catch (e) {
    return false;
  }
}

export const formatNumber = (value: number) =>
  new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD'
  }).format(value)


export async function handleOnImageFileUpload(file: File): Promise<any> {
  try {

    const validImageTypes = ["image/jpeg", "image/png",];
    if (!validImageTypes.includes(file.type)) {
      throw new Error("Invalid image type");
    }
    const mimeType = await getMimeType(file).catch((e) => {
      return "application/octet-stream"
    });

    if (mimeType !== "image/jpeg" &&
      mimeType !== "image/png"
    ) {
      return { status: false, error: `Invalid image format. Detected ${mimeType}` };
    }

    return new Promise(async (resolve, reject) => {
      let img = new Image()
      img.onload = () => resolve({
        status: true,
        src: img.src,
        imageSize: prettyBytes(file.size),
        imageWidth: img.naturalWidth,
        imageHeight: img.naturalHeight,
        imageURL: img.src,
        fileExtension: file.name.split(".").pop(),
        width: img.naturalWidth,
        height: img.naturalHeight,

      })
      img.onerror = reject
      img.src = window.URL.createObjectURL(file);




    })

  } catch (error) {
    return { status: false, error: 'Failed to load image' };
  }
}


export const imageShimmer = (w: number, h: number) => `
<svg width="${w}" height="${h}" version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink">
  <defs>
    <linearGradient id="g">
      <stop stop-color="#333" offset="20%" />
      <stop stop-color="#222" offset="50%" />
      <stop stop-color="#333" offset="70%" />
    </linearGradient>
  </defs>
  <rect width="${w}" height="${h}" fill="#333" />
  <rect id="r" width="${w}" height="${h}" fill="url(#g)" />
  <animate xlink:href="#r" attributeName="x" from="-${w}" to="${w}" dur="1s" repeatCount="indefinite"  />
</svg>`;


export const toBase64 = (str: string) =>
  typeof window === "undefined"
    ? Buffer.from(str).toString("base64")
    : window.btoa(str);



export const capitalizeFirstLetter = (str: string): string => {
  return str?.split(" ")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");
};



export function tryParseJSONObject(jsonString: string): boolean {
  try {
    var o = JSON.parse(jsonString);

    // Handle non-exception-throwing cases:
    // Neither JSON.parse(false) or JSON.parse(1234) throw errors, hence the type-checking,
    // but... JSON.parse(null) returns null, and typeof null === "object", 
    // so we must check for that, too. Thankfully, null is falsey, so this suffices:
    if (o && typeof o === "object") {
      return o;
    }
  }
  catch (e) { }

  return false;
};


export function firestoreAutoId(): string {
  const chars =
    'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  let id = '';
  while (id.length < 20) {
    const bytes = randomBytes(40);
    // eslint-disable-next-line @typescript-eslint/no-loop-func
    bytes.forEach(b => {
      // Length of `chars` is 62. We only take bytes between 0 and 62*4-1
      // (both inclusive). The value is then evenly mapped to indices of `char`
      // via a modulo operation.
      const maxValue = 62 * 4 - 1;
      if (id.length < 20 && b <= maxValue) {
        id += chars.charAt(b % 62);
      }
    });
  }
  return id;
}



export function removeDuplicateMessages(messages: Message[]): Message[] {
  const uniqueMessagesMap: { [id: string]: Message } = {};

  // Iterate through the messages array and store the last occurrence of each id
  for (const message of messages) {
    uniqueMessagesMap[message.id] = message;
  }

  // Convert the unique messages map back to an array
  const uniqueMessages: Message[] = Object.values(uniqueMessagesMap);

  return uniqueMessages;
}


export function getUserInitials(name: string) {
  const [firstName, lastName] = name.split(' ')
  return lastName ? `${firstName[0]}${lastName[0]}` : firstName.slice(0, 2)
}


export function convertToSGT(dateString: string): string {
  const inputDate = new Date(`${dateString.replace(/\s+UTC[\s\S]*$/, '')} UTC`);
  const sgtDate = new Date(inputDate.getTime() + 8 * 60 * 60 * 1000);

  const year = sgtDate.getFullYear();
  const month = String(sgtDate.getMonth() + 1).padStart(2, '0');
  const day = String(sgtDate.getDate()).padStart(2, '0');
  const hours = String(sgtDate.getHours()).padStart(2, '0');
  const minutes = String(sgtDate.getMinutes()).padStart(2, '0');
  const seconds = String(sgtDate.getSeconds()).padStart(2, '0');

  return `${month}/${day}/${year} ${hours}:${minutes}:${seconds}`;
}



export function isAgentChatTypeValid(agentChatType: string): agentChatType is keyof typeof AgentChatTypeEnum {
  try {
    const lowerCaseChatType = agentChatType?.toUpperCase() as keyof typeof AgentChatTypeEnum;
    return Object.values(AgentChatTypeEnum).includes(AgentChatTypeEnum[lowerCaseChatType]);
  } catch (error) {
    console.error(`Error in isAgentChatTypeValid: ${error}`)
    return false
  }
}

export const runAsyncFnWithoutBlocking = (
  fn: (...args: any) => Promise<any>
) => {
  fn()
}

