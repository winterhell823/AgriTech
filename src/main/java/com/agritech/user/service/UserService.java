package com.agritech.user.service;

import com.agritech.user.dto.UserRequestDto;
import com.agritech.user.dto.UserResponseDto;
import com.agritech.user.model.UserRole;

import java.util.List;

public interface UserService {

    UserResponseDto create(UserRequestDto requestDto);

    UserResponseDto getById(Long id);

    UserResponseDto getByEmail(String email);

    List<UserResponseDto> getAll();

    List<UserResponseDto> getByRole(UserRole role);

    UserResponseDto update(Long id, UserRequestDto requestDto);

    void delete(Long id);
}