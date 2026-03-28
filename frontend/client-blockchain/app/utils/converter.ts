/**
 * Chuyển đổi chuỗi thời gian ISO thành định dạng "dd-mm-yyyy hh:mm:ss"
 * @param isoString Chuỗi thời gian (VD: "2026-02-13T04:06:56.730+00:00")
 * @returns Chuỗi đã format (VD: "13-02-2026 11:06:56")
 */
export const formatDateTime = (isoString: string | null | undefined): string => {
    if (!isoString) return "N/A"; // Trả về mặc định nếu không có dữ liệu

    const date = new Date(isoString);

    // Kiểm tra tính hợp lệ của ngày
    if (isNaN(date.getTime())) return "Invalid Date";

    const day = String(date.getDate()).padStart(2, "0");
    const month = String(date.getMonth() + 1).padStart(2, "0"); // Tháng trong JS bắt đầu từ 0
    const year = date.getFullYear();

    const hours = String(date.getHours()).padStart(2, "0");
    const minutes = String(date.getMinutes()).padStart(2, "0");
    const seconds = String(date.getSeconds()).padStart(2, "0");

    return `${day}-${month}-${year} ${hours}:${minutes}:${seconds}`;
};

export const formatTime = (audioDurationSeconds: number) => {
    return `(${Math.floor(audioDurationSeconds / 60)}:${(audioDurationSeconds % 60).toString().padStart(2, "0")})`;
}

export const extractName = (input: string) => {
    const atIndex = input.indexOf('@');
    return (atIndex > 0) ? input.substring(0, atIndex) : input;
};