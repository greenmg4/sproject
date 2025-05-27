// 랜덤 색상 생성 함수
export const getColorByValue = (value) => {
    const generateRandomColor = () => {
        const randomValue = () => Math.floor(Math.random() * 256); // 0~255 사이의 랜덤 값 생성
        const r = randomValue();
        const g = randomValue();
        const b = randomValue();
        return { r, g, b };
    };

    const { r, g, b } = generateRandomColor();

    return `rgba(${r}, ${g}, ${b}, 0.6)`; // 배경색
};

// 색상 조정 함수
export const adjustColor = (color, amount) => {
    const rgbaMatch = color.match(/rgba?\((\d+), (\d+), (\d+)/); // r, g, b 값 추출
    if (rgbaMatch) {
        const r = Math.max(0, parseInt(rgbaMatch[1]) - amount); // r 값 낮춤
        const g = Math.max(0, parseInt(rgbaMatch[2]) - amount); // g 값 낮춤
        const b = Math.max(0, parseInt(rgbaMatch[3]) - amount); // b 값 낮춤
        return `rgba(${r}, ${g}, ${b}, 1)`; // 조정된 색상 반환
    }
    return color; // 매칭 실패 시 원래 색상 반환
};