import { useEffect, useState } from "react"
import Alert from "@mui/material/Alert"
import Box from "@mui/material/Box"
import Button from "@mui/material/Button"
import Typography from "@mui/material/Typography"
import CircularProgress from "@mui/material/CircularProgress"
import Divider from "@mui/material/Divider"
import { useNavigate } from "react-router-dom"
import { fetchUserAPI, logoutAPI } from "~/apis"
import Setup2FA from "~/components/setup-2fa"
import Require2FA from "~/components/require-2fa"
import bghutech from "../assets/bghutech.jpg"

function Dashboard() {
  const [user, setUser] = useState(null)
  const [openSetup2FA, setOpenSetup2FA] = useState(false)
  const [results, setResults] = useState(Array(10).fill(""))
  const [buttonColors, setButtonColors] = useState(
    Array(10).fill(Array(4).fill("primary.main"))
  )

  const [score, setScore] = useState(10)
  const [isFinished, setIsFinished] = useState(false)
  const navigate = useNavigate()

  useEffect(() => {
    const fetchData = async () => {
      const user = await fetchUserAPI()
      setUser(user)
    }
    fetchData()
  }, [])

  const handleLogout = async () => {
    await logoutAPI(user._id)
    localStorage.removeItem("userInfo")
    navigate("/login")
  }

  const handleSuccessSetup2FA = (updatedUser) => {
    setUser(updatedUser)
    localStorage.setItem("userInfo", JSON.stringify(updatedUser))
    setOpenSetup2FA(false)
  }

  const handleSuccessVerify2FA = (updatedUser) => {
    setUser(updatedUser)
    localStorage.setItem("userInfo", JSON.stringify(updatedUser))
  }

  const handleMultipleChoice = (isCorrect, questionIndex, answerIndex) => {
    // Kiểm tra nếu đã chọn đáp án
    if (results[questionIndex] !== "") return

    const newResults = [...results]
    newResults[questionIndex] = isCorrect ? "Correct!" : "Incorrect!"

    // Hiện điểm
    if (!isCorrect) {
      setScore((score) => score - 1)
    }

    // Đổi màu nút
    const newButtonColors = buttonColors.map((colors, index) =>
      index === questionIndex
        ? colors.map((color, idx) =>
            idx === answerIndex ? (isCorrect ? "green" : "red") : color
          )
        : colors
    )

    setResults(newResults)
    setButtonColors(newButtonColors)

    // Kiểm tra xem tất cả câu hỏi đã được trả lời chưa
    if (newResults.every((result) => result !== "")) {
      setIsFinished(true)
    }
  }

  if (!user) {
    return (
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          gap: 2,
          width: "100vw",
          height: "100vh",
        }}
      >
        <CircularProgress />
        <Typography>Loading dashboard user...</Typography>
      </Box>
    )
  }

  return (
    <Box
      sx={{
        maxWidth: "1120px",
        margin: "1em auto",
        display: "flex",
        justifyContent: "center",
        flexDirection: "column",
        gap: 1,
        padding: "0 1em",
      }}
    >
      {/* Modal để user cài đặt 2FA */}
      <Setup2FA
        isOpen={openSetup2FA}
        toggleOpen={setOpenSetup2FA}
        user={user}
        handleSuccessSetup2FA={handleSuccessSetup2FA}
      />

      {/* Modal yêu cầu xác thực 2FA */}
      {user.require_2fa && !user.is_2fa_verified && (
        <Require2FA
          user={user}
          handleSuccessVerify2FA={handleSuccessVerify2FA}
        />
      )}

      <Box>
        <a
          style={{ color: "inherit", textDecoration: "none" }}
          href=""
          target="_blank"
          rel="noreferrer"
        >
          <img
            style={{
              width: "100%",
              height: "180px",
              borderRadius: "6px",
              objectFit: "cover",
            }}
            src={bghutech}
            alt="Team-7FU"
          />
        </a>
      </Box>

      <Alert
        severity="info"
        sx={{ ".MuiAlert-message": { overflow: "hidden" } }}
      >
        User:&nbsp
        <Typography
          variant="span"
          sx={{
            fontWeight: "bold",
            "&:hover": { color: "#e67e22", cursor: "pointer" },
          }}
        >
          {user.email}
        </Typography>
        &nbsp đăng nhập thành công.
      </Alert>

      <Alert
        severity={`${user.require_2fa ? "success" : "warning"}`}
        sx={{ ".MuiAlert-message": { overflow: "hidden" } }}
      >
        Tình trạng bảo mật tài khoản:&nbsp
        <Typography
          variant="span"
          sx={{
            fontWeight: "bold",
            "&:hover": { color: "#e67e22", cursor: "pointer" },
          }}
        >
          {user.require_2fa ? "Đã Bật" : "Chưa Bật"} xác thực 2 lớp - Two-Factor
          Authentication (2FA)
        </Typography>
      </Alert>

      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "end",
          gap: 2,
          mt: 1,
        }}
      >
        {!user.require_2fa && (
          <Button
            type="button"
            variant="contained"
            color="warning"
            size="large"
            sx={{ maxWidth: "max-content" }}
            onClick={() => setOpenSetup2FA(true)}
          >
            Enable 2FA
          </Button>
        )}

        <Button
          type="button"
          variant="contained"
          color="info"
          size="large"
          sx={{ maxWidth: "max-content" }}
          onClick={handleLogout}
        >
          Logout
        </Button>
      </Box>

      <Divider sx={{ my: 2 }} />

      {/* Phần câu hỏi trắc nghiệm */}
      <Box sx={{ my: 3 }}>
        <Typography variant="h5">Phần 1: Trắc nghiệm</Typography>
        <Divider sx={{ my: 1 }} />
        {/* Câu hỏi 1 */}
        <Typography variant="h6">Phần mềm độc hại (malware) là gì?</Typography>
        <Box sx={{ display: "flex", gap: 2, mt: 2 }}>
          <Button
            variant="contained"
            onClick={() => handleMultipleChoice(false, 0, 0)}
            sx={{ backgroundColor: buttonColors[0][0] }}
          >
            A) Phần mềm an toàn
          </Button>
          <Button
            variant="contained"
            onClick={() => handleMultipleChoice(true, 0, 1)}
            sx={{ backgroundColor: buttonColors[0][1] }}
          >
            B) Phần mềm gây hại cho hệ thống
          </Button>
          <Button
            variant="contained"
            onClick={() => handleMultipleChoice(false, 0, 2)}
            sx={{ backgroundColor: buttonColors[0][2] }}
          >
            C) Phần mềm văn phòng
          </Button>
          <Button
            variant="contained"
            onClick={() => handleMultipleChoice(false, 0, 3)}
            sx={{ backgroundColor: buttonColors[0][3] }}
          >
            D) Phần mềm diệt virus
          </Button>
        </Box>
        <Typography
          variant="body1"
          sx={{ mt: 2, color: results[0] === "Correct!" ? "green" : "red" }}
        >
          {results[0]}
        </Typography>
        {/* Câu hỏi 2 */}
        <Typography variant="h6">
          Mật khẩu nào sau đây là an toàn nhất?
        </Typography>
        <Box sx={{ display: "flex", gap: 2, mt: 2 }}>
          <Button
            variant="contained"
            onClick={() => handleMultipleChoice(false, 1, 0)}
            sx={{ backgroundColor: buttonColors[1][0] }}
          >
            A) 123456
          </Button>
          <Button
            variant="contained"
            onClick={() => handleMultipleChoice(false, 1, 1)}
            sx={{ backgroundColor: buttonColors[1][1] }}
          >
            B) password
          </Button>
          <Button
            variant="contained"
            onClick={() => handleMultipleChoice(true, 1, 2)}
            sx={{ backgroundColor: buttonColors[1][2] }}
          >
            C) aB3#xY9$
          </Button>
          <Button
            variant="contained"
            onClick={() => handleMultipleChoice(false, 1, 3)}
            sx={{ backgroundColor: buttonColors[1][3] }}
          >
            D) qwerty
          </Button>
        </Box>
        <Typography
          variant="body1"
          sx={{ mt: 2, color: results[1] === "Correct!" ? "green" : "red" }}
        >
          {results[1]}
        </Typography>
        {/* Câu hỏi 3 */}
        <Typography variant="h6">
          Xác thực hai yếu tố (2FA) có chức năng gì?
        </Typography>
        <Box sx={{ display: "flex", gap: 2, mt: 2 }}>
          <Button
            variant="contained"
            onClick={() => handleMultipleChoice(true, 2, 0)}
            sx={{ backgroundColor: buttonColors[2][0] }}
          >
            A) Tăng cường bảo mật tài khoản
          </Button>
          <Button
            variant="contained"
            onClick={() => handleMultipleChoice(false, 2, 1)}
            sx={{ backgroundColor: buttonColors[2][1] }}
          >
            B) Giảm dung lượng lưu trữ
          </Button>
          <Button
            variant="contained"
            onClick={() => handleMultipleChoice(false, 2, 2)}
            sx={{ backgroundColor: buttonColors[2][2] }}
          >
            C) Tăng tốc độ mạng
          </Button>
          <Button
            variant="contained"
            onClick={() => handleMultipleChoice(false, 2, 3)}
            sx={{ backgroundColor: buttonColors[2][3] }}
          >
            D) Cải thiện trải nghiệm người dùng
          </Button>
        </Box>
        <Typography
          variant="body1"
          sx={{ mt: 2, color: results[2] === "Correct!" ? "green" : "red" }}
        >
          {results[2]}
        </Typography>
        {/* Câu hỏi 4 */}
        <Typography variant="h6">
          Một trong những cách tốt nhất để bảo vệ thông tin cá nhân trên mạng xã
          hội là gì?
        </Typography>
        <Box sx={{ display: "flex", gap: 2, mt: 2 }}>
          <Button
            variant="contained"
            onClick={() => handleMultipleChoice(false, 3, 0)}
            sx={{ backgroundColor: buttonColors[3][0] }}
          >
            A) Chia sẻ mọi thông tin công khai
          </Button>
          <Button
            variant="contained"
            onClick={() => handleMultipleChoice(true, 3, 1)}
            sx={{ backgroundColor: buttonColors[3][1] }}
          >
            B) Sử dụng cài đặt quyền riêng tư
          </Button>
          <Button
            variant="contained"
            onClick={() => handleMultipleChoice(false, 3, 2)}
            sx={{ backgroundColor: buttonColors[3][2] }}
          >
            C) Không sử dụng mạng xã hội
          </Button>
          <Button
            variant="contained"
            onClick={() => handleMultipleChoice(false, 3, 3)}
            sx={{ backgroundColor: buttonColors[3][3] }}
          >
            D) Tham gia vào mọi nhóm công khai
          </Button>
        </Box>
        <Typography
          variant="body1"
          sx={{ mt: 2, color: results[3] === "Correct!" ? "green" : "red" }}
        >
          {results[3]}
        </Typography>
        {/* Câu hỏi 5 */}
        <Typography variant="h6">Phishing là gì?</Typography>
        <Box sx={{ display: "flex", gap: 2, mt: 2 }}>
          <Button
            variant="contained"
            onClick={() => handleMultipleChoice(false, 4, 0)}
            sx={{ backgroundColor: buttonColors[4][0] }}
          >
            A) Một loại virus máy tính
          </Button>
          <Button
            variant="contained"
            onClick={() => handleMultipleChoice(true, 4, 1)}
            sx={{ backgroundColor: buttonColors[4][1] }}
          >
            B) Một phương thức lừa đảo trực tuyến
          </Button>
          <Button
            variant="contained"
            onClick={() => handleMultipleChoice(false, 4, 2)}
            sx={{ backgroundColor: buttonColors[4][2] }}
          >
            C) Phần mềm diệt virus
          </Button>
          <Button
            variant="contained"
            onClick={() => handleMultipleChoice(false, 4, 3)}
            sx={{ backgroundColor: buttonColors[4][3] }}
          >
            D) Một kỹ thuật mã hóa
          </Button>
        </Box>
        <Typography
          variant="body1"
          sx={{ mt: 2, color: results[4] === "Correct!" ? "green" : "red" }}
        >
          {results[4]}
        </Typography>
        {/* Câu hỏi 6 */}
        <Typography variant="h6">
          Làm thế nào để bảo vệ dữ liệu trên thiết bị di động?
        </Typography>
        <Box sx={{ display: "flex", gap: 2, mt: 2 }}>
          <Button
            variant="contained"
            onClick={() => handleMultipleChoice(false, 5, 0)}
            sx={{ backgroundColor: buttonColors[5][0] }}
          >
            A) Không sử dụng mật khẩu
          </Button>
          <Button
            variant="contained"
            onClick={() => handleMultipleChoice(false, 5, 1)}
            sx={{ backgroundColor: buttonColors[5][1] }}
          >
            B) Cài đặt ứng dụng không rõ nguồn gốc
          </Button>
          <Button
            variant="contained"
            onClick={() => handleMultipleChoice(true, 5, 2)}
            sx={{ backgroundColor: buttonColors[5][2] }}
          >
            C) Sử dụng mã PIN hoặc khóa vân tay
          </Button>
          <Button
            variant="contained"
            onClick={() => handleMultipleChoice(false, 5, 3)}
            sx={{ backgroundColor: buttonColors[5][3] }}
          >
            D) Tắt chế độ bảo mật
          </Button>
        </Box>
        <Typography
          variant="body1"
          sx={{ mt: 2, color: results[5] === "Correct!" ? "green" : "red" }}
        >
          {results[5]}
        </Typography>
        {/* Câu hỏi 7 */}
        <Typography variant="h6">
          Đâu là lợi ích của việc sử dụng phần mềm diệt virus?
        </Typography>
        <Box sx={{ display: "flex", gap: 2, mt: 2 }}>
          <Button
            variant="contained"
            onClick={() => handleMultipleChoice(false, 6, 0)}
            sx={{ backgroundColor: buttonColors[6][0] }}
          >
            A) Giúp nâng cao tốc độ máy tính
          </Button>
          <Button
            variant="contained"
            onClick={() => handleMultipleChoice(true, 6, 1)}
            sx={{ backgroundColor: buttonColors[6][1] }}
          >
            B) Ngăn chặn các cuộc tấn công mạng
          </Button>
          <Button
            variant="contained"
            onClick={() => handleMultipleChoice(false, 6, 2)}
            sx={{ backgroundColor: buttonColors[6][2] }}
          >
            C) Tự động cập nhật hệ điều hành
          </Button>
          <Button
            variant="contained"
            onClick={() => handleMultipleChoice(false, 6, 3)}
            sx={{ backgroundColor: buttonColors[6][3] }}
          >
            D) Bảo vệ dữ liệu cá nhân khỏi xóa nhầm
          </Button>
        </Box>
        <Typography
          variant="body1"
          sx={{ mt: 2, color: results[6] === "Correct!" ? "green" : "red" }}
        >
          {results[6]}
        </Typography>
        {/* Câu hỏi 8 */}
        <Typography variant="h6">
          Tại sao cần sao lưu dữ liệu thường xuyên?
        </Typography>
        <Box sx={{ display: "flex", gap: 2, mt: 2 }}>
          <Button
            variant="contained"
            onClick={() => handleMultipleChoice(false, 7, 0)}
            sx={{ backgroundColor: buttonColors[7][0] }}
          >
            A) Để tiết kiệm không gian lưu trữ
          </Button>
          <Button
            variant="contained"
            onClick={() => handleMultipleChoice(true, 7, 1)}
            sx={{ backgroundColor: buttonColors[7][1] }}
          >
            B) Để phục hồi dữ liệu khi gặp sự cố
          </Button>
          <Button
            variant="contained"
            onClick={() => handleMultipleChoice(false, 7, 2)}
            sx={{ backgroundColor: buttonColors[7][2] }}
          >
            C) Để tăng tốc độ truy cập dữ liệu
          </Button>
          <Button
            variant="contained"
            onClick={() => handleMultipleChoice(false, 7, 3)}
            sx={{ backgroundColor: buttonColors[7][3] }}
          >
            D) Để chia sẻ dữ liệu với người khác
          </Button>
        </Box>
        <Typography
          variant="body1"
          sx={{ mt: 2, color: results[7] === "Correct!" ? "green" : "red" }}
        >
          {results[7]}
        </Typography>
        {/* Câu hỏi 9 */}
        <Typography variant="h6">Sử dụng VPN có lợi ích gì?</Typography>
        <Box sx={{ display: "flex", gap: 2, mt: 2 }}>
          <Button
            variant="contained"
            onClick={() => handleMultipleChoice(false, 8, 0)}
            sx={{ backgroundColor: buttonColors[8][0] }}
          >
            A) Tăng tốc độ internet
          </Button>
          <Button
            variant="contained"
            onClick={() => handleMultipleChoice(true, 8, 1)}
            sx={{ backgroundColor: buttonColors[8][1] }}
          >
            B) Bảo vệ thông tin cá nhân trên mạng
          </Button>
          <Button
            variant="contained"
            onClick={() => handleMultipleChoice(false, 8, 2)}
            sx={{ backgroundColor: buttonColors[8][2] }}
          >
            C) Giảm chi phí truy cập internet
          </Button>
          <Button
            variant="contained"
            onClick={() => handleMultipleChoice(false, 8, 3)}
            sx={{ backgroundColor: buttonColors[8][3] }}
          >
            D) Tăng dung lượng lưu trữ
          </Button>
        </Box>
        <Typography
          variant="body1"
          sx={{ mt: 2, color: results[8] === "Correct!" ? "green" : "red" }}
        >
          {results[8]}
        </Typography>
        {/* Câu hỏi 10 */}
        <Typography variant="h6">
          Điều gì không nên làm khi sử dụng wifi công cộng?
        </Typography>
        <Box sx={{ display: "flex", gap: 2, mt: 2 }}>
          <Button
            variant="contained"
            onClick={() => handleMultipleChoice(false, 9, 0)}
            sx={{ backgroundColor: buttonColors[9][0] }}
          >
            A) Kết nối với wifi công cộng
          </Button>
          <Button
            variant="contained"
            onClick={() => handleMultipleChoice(false, 9, 1)}
            sx={{ backgroundColor: buttonColors[9][1] }}
          >
            B) Sử dụng mạng riêng ảo (VPN)
          </Button>
          <Button
            variant="contained"
            onClick={() => handleMultipleChoice(true, 9, 2)}
            sx={{ backgroundColor: buttonColors[9][2] }}
          >
            C) Truy cập thông tin nhạy cảm
          </Button>
          <Button
            variant="contained"
            onClick={() => handleMultipleChoice(false, 9, 3)}
            sx={{ backgroundColor: buttonColors[9][3] }}
          >
            D) Sử dụng các trang web bảo mật
          </Button>
        </Box>
        <Typography
          variant="body1"
          sx={{ mt: 2, color: results[9] === "Correct!" ? "green" : "red" }}
        >
          {results[9]}
        </Typography>
        {isFinished && (
          <Typography variant="h5" align="center" sx={{ mt: 4 }}>
            Tổng điểm: {score}
          </Typography>
        )}
      </Box>
    </Box>
  )
}

export default Dashboard
