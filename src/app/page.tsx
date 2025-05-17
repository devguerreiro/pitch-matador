import { Button } from "@/components/ui/button";

export default function Home() {
  return (
    <div className="container h-screen flex justify-center items-center">
      <Button
        className="h-24 w-24 rounded-full bg-transparent border-2 border-primary text-primary text-lg font-semibold uppercase hover:bg-primary/80 hover:text-white hover:cursor-pointer hover:scale-110 duration-300"
        size="lg"
      >
        Ouvir
      </Button>
    </div>
  );
}
