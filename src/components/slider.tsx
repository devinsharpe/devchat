import * as RadixSlider from "@radix-ui/react-slider";

function Slider({
  defaultValue,
  label,
  max,
  step,
  ...props
}: RadixSlider.SliderProps & {
  label: string;
}) {
  return (
    <RadixSlider.Root
      className="relative flex h-5 w-full touch-none select-none items-center"
      defaultValue={defaultValue}
      max={max}
      step={step}
      {...props}
    >
      <RadixSlider.Track className="relative h-1 grow rounded-full bg-zinc-900">
        <RadixSlider.Range className="absolute h-full rounded-full bg-white" />
      </RadixSlider.Track>
      <RadixSlider.Thumb
        className="block h-5 w-5 rounded-full bg-white shadow-md hover:bg-violet-400 focus:shadow-lg focus:outline-none"
        aria-label={label}
      />
    </RadixSlider.Root>
  );
}

export default Slider;
