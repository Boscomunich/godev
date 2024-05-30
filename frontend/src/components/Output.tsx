const INSTANCE_URI = "http://localhost:3000";

export const Output = () => {
    return (
        <div className="h-[40vh] bg-white">
            <iframe width={"100%"} height={"100%"} src={`${INSTANCE_URI}`} />
        </div>
    );
}