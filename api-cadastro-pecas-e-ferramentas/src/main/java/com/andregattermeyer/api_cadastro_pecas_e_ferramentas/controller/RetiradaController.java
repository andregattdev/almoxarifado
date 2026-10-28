package com.andregattermeyer.api_cadastro_pecas_e_ferramentas.controller;

import java.util.List;

import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseStatus;
import org.springframework.web.bind.annotation.RestController;

import com.andregattermeyer.api_cadastro_pecas_e_ferramentas.model.Retirada;
import com.andregattermeyer.api_cadastro_pecas_e_ferramentas.service.RetiradaService;

@RestController
@RequestMapping("/api/retiradas")
public class RetiradaController {

    private final RetiradaService retiradaService;

    public RetiradaController(RetiradaService retiradaService) {
        this.retiradaService = retiradaService;
    }

    @GetMapping
    public List<Retirada> listarTodas() {
        return retiradaService.listarTodas();
    }

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public Retirada registrar(@RequestBody RetiradaRequest request) {
        return retiradaService.registrar(request.funcionarioId(), request.pecaId());
    }

    @PutMapping("/{id}/devolucao")
    public Retirada registrarDevolucao(@PathVariable Long id) {
        return retiradaService.registrarDevolucao(id);
    }

    public record RetiradaRequest(Long funcionarioId, Long pecaId) {
    }
}