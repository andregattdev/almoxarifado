package com.andregattermeyer.api_cadastro_pecas_e_ferramentas.exception;

import java.util.stream.Collectors;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.http.converter.HttpMessageConversionException;
import org.springframework.http.converter.HttpMessageNotReadableException;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.ControllerAdvice;
import org.springframework.web.bind.annotation.ExceptionHandler;

@ControllerAdvice
public class GlobalExceptionHandler {

    @ExceptionHandler(PecaNotFoundException.class)
    public ResponseEntity<String> handlePecaNotFound(PecaNotFoundException ex) {
        return ResponseEntity.status(HttpStatus.NOT_FOUND).body(ex.getMessage());
    }

    @ExceptionHandler(LoteNotFoundException.class)
    public ResponseEntity<String> handleLoteNotFound(LoteNotFoundException ex) {
        return ResponseEntity.status(HttpStatus.NOT_FOUND).body(ex.getMessage());
    }

    @ExceptionHandler(EspecificacaoNotFoundException.class)
    public ResponseEntity<String> handleEspecificacaoNotFound(EspecificacaoNotFoundException ex) {
        return ResponseEntity.status(HttpStatus.NOT_FOUND).body(ex.getMessage());
    }

    @ExceptionHandler(BusinessException.class)
    public ResponseEntity<String> handleBusiness(BusinessException ex) {
        return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(ex.getMessage());
    }

    @ExceptionHandler(MethodArgumentNotValidException.class)
    public ResponseEntity<String> handleValidation(MethodArgumentNotValidException ex) {
        String detalhes = ex.getBindingResult().getFieldErrors().stream()
                .map(erro -> erro.getField() + ": " + erro.getDefaultMessage())
                .collect(Collectors.joining("; "));
        return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(detalhes);
    }

    @ExceptionHandler({ HttpMessageNotReadableException.class, HttpMessageConversionException.class })
    public ResponseEntity<String> handleUnreadable(Exception ex) {
        Throwable causa = ex;
        while (causa.getCause() != null && causa.getCause() != causa) {
            causa = causa.getCause();
        }
        return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                .body("JSON inválido: " + causa.getMessage());
    }

    @ExceptionHandler(Exception.class)
    public ResponseEntity<String> handleGeneric(Exception ex) {
        String mensagem = ex.getMessage() != null ? ex.getMessage() : "";
        if (mensagem.contains("FAIL_ON_NULL_FOR_PRIMITIVES") || mensagem.contains("JSON parse error")) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("JSON inválido: " + mensagem);
        }
        return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                .body("Erro inesperado: " + ex.getMessage());
    }
}
