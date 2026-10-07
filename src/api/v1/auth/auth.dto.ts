export interface RegisterRequestDto {
	email: string;
	password: string;
}

export interface LoginRequestDto {
	email: string;
	password: string;
}

export interface LoginResponseDto {
	access_token: string;
}
