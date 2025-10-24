export function GridStyleBackground() {
    return (
        <div className="absolute inset-0 z-0">
        <div
          className="h-full w-full opacity-30"
          style={{
            backgroundImage: `
              linear-gradient(rgba(59, 130, 246, 0.3) 1px, transparent 1px),
              linear-gradient(90deg, rgba(59, 130, 246, 0.3) 1px, transparent 1px)
            `,
            backgroundSize: "50px 50px",
            backgroundPosition: "center center",
          }}
        />
      </div>
    )
}