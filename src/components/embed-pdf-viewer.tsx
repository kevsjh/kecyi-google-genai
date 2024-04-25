export default function EmbedPDFViewer({ blobURL }: { blobURL: string }) {
  return (
    <object
      title="pdf-viewer"
      data={blobURL}
      className="z-0 h-[100%] w-full text-clip"
    >
      <div className="flex flex-col items-center justify-center">Oops! Your browser doesn&apos;t support PDFs</div>
    </object>
  );
}
