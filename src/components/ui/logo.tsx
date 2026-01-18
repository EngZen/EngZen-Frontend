export const Logo = ({
  width = 40,
  height = 40,
}: {
  width?: number;
  height?: number;
}) => {
  return (
    <div className="p-1 w-fit text-primary bg-white rounded-xs">
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width={width}
        height={height}
        viewBox="0 0 150 123"
        fill="none"
      >
        <path
          d="M0 123.006V0H40.7975L62.5766 29.1411H29.1411V48.773H85.5827L63.4969 77.6074H29.1411V93.865H52.4539L30.3681 123.006H0Z"
          fill="currentColor"
        />
        <path
          d="M37.7302 123.006H150V94.1718H97.8528L150 28.8344V0H50.0001L71.7792 28.8344H111.656L37.7302 123.006Z"
          fill="currentColor"
        />
      </svg>
    </div>
  );
};
