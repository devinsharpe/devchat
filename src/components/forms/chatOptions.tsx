import { Cog, Send } from "lucide-react";
import Slider from "../slider";
import Loader from "../loader";

export interface ChatOptions {
  message: string;
  systemPrompt: string;
  maxNewTokens: number;
  minNewTokens: number;
  temperature: number;
}

interface ChatOptionsFormProps {
  isLoading: boolean;
  options: ChatOptions;
  showAdvancedOptions: boolean;
  onShowAdvancedOptionsChange: (showAdvancedOptions: boolean) => void;
  onChange: (opts: Partial<ChatOptions>) => void;
  onSubmit: () => void | Promise<void>;
}

function ChatOptionsForm({
  isLoading,
  options,
  showAdvancedOptions,
  onChange,
  onShowAdvancedOptionsChange,
  onSubmit,
}: ChatOptionsFormProps) {
  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        void onSubmit();
      }}
      className="flex flex-col gap-4"
    >
      <fieldset className="flex flex-col">
        <label className="block rounded-t-lg border-x border-t border-zinc-500 bg-zinc-700 p-2 text-zinc-200">
          Message
        </label>
        <textarea
          id="message"
          className="w-full rounded-b-lg border border-zinc-500 bg-zinc-700 p-3 text-white"
          placeholder="Hey there!"
          onChange={(e) => onChange({ message: e.target.value })}
          value={options.message}
        ></textarea>
      </fieldset>
      {showAdvancedOptions && (
        <>
          <div className="flex items-center gap-4">
            <div className="h-[1px] w-full bg-zinc-400" />
            <span className="whitespace-nowrap text-sm text-zinc-400">
              Advanced Options
            </span>
            <div className="h-[1px] w-full bg-zinc-400" />
          </div>
          <fieldset className="flex flex-col">
            <label className="block rounded-t-lg border-x border-t border-zinc-500 bg-zinc-700 p-2 text-zinc-200">
              System Prompt
            </label>
            <textarea
              id="system-prompt"
              className="w-full rounded-b-lg border border-zinc-500 bg-zinc-700 p-3 text-white"
              placeholder="You are a helpful, assistant bot..."
              value={options.systemPrompt}
              onChange={(e) => onChange({ systemPrompt: e.target.value })}
            ></textarea>
          </fieldset>
          <fieldset className="flex flex-col gap-2 px-2">
            <div className="flex items-center justify-between">
              <label className="block whitespace-nowrap p-2  text-zinc-200">
                Temperature
              </label>
              <input
                id="temperature"
                type="number"
                className="w-20 rounded-lg border border-zinc-500 bg-zinc-700 p-2 text-sm text-white"
                placeholder="75"
                value={options.temperature}
                onChange={(e) =>
                  onChange({ temperature: parseInt(e.target.value) ?? 0 })
                }
              />
            </div>
            <Slider
              min={0}
              max={5}
              step={0.01}
              value={[options.temperature]}
              onValueChange={(val) => onChange({ temperature: val[0]! })}
              label="LLaMA Temperature"
            />
          </fieldset>
          <fieldset className="flex">
            <label className="block w-full whitespace-nowrap rounded-l-lg border-y border-l border-zinc-500 bg-zinc-700 p-2 px-4 text-zinc-200">
              Max New Tokens
            </label>
            <input
              id="max-new-tokens"
              type="number"
              className="w-24 rounded-r-lg border border-zinc-500 bg-zinc-700 p-3 text-white"
              placeholder="You are a helpful, assistant bot..."
              value={options.maxNewTokens}
              onChange={(e) =>
                onChange({ maxNewTokens: parseInt(e.target.value) ?? 0 })
              }
            />
          </fieldset>
          <fieldset className="flex">
            <label className="block w-full whitespace-nowrap rounded-l-lg border-y border-l border-zinc-500 bg-zinc-700 p-2 px-4 text-zinc-200">
              Min New Tokens
            </label>
            <input
              id="min-new-tokens"
              type="number"
              className="w-24 rounded-r-lg border border-zinc-500 bg-zinc-700 p-3 text-white"
              placeholder="You are a helpful, assistant bot..."
              value={options.minNewTokens}
              onChange={(e) =>
                onChange({ minNewTokens: parseInt(e.target.value) ?? 0 })
              }
            />
          </fieldset>
        </>
      )}

      <div className="flex w-full gap-2">
        <button
          className="flex w-full items-center justify-center gap-2 rounded-lg bg-gradient-to-br from-pink-200 via-purple-300 to-indigo-300 bg-size-200 bg-pos-0 py-3 text-zinc-800 transition-all duration-500 hover:scale-[1.02] hover:bg-pos-100"
          disabled={isLoading}
          type="submit"
        >
          <Loader isLoading={isLoading}>
            <Send />
          </Loader>
          <span>Send message</span>
        </button>
        <button
          className="flex items-center gap-2 rounded-xl bg-gradient-to-r from-zinc-200 via-zinc-200 to-zinc-400 bg-size-200 bg-pos-0 px-4 py-2 text-sm font-semibold text-zinc-800 transition-all duration-500 hover:scale-105 hover:bg-pos-100"
          onClick={() => onShowAdvancedOptionsChange(!showAdvancedOptions)}
        >
          <Cog />
          <span className="sr-only">Configure</span>
        </button>
      </div>
    </form>
  );
}

export default ChatOptionsForm;
