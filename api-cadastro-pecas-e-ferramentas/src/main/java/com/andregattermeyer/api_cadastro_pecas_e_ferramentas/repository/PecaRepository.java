package com.andregattermeyer.api_cadastro_pecas_e_ferramentas.repository;

import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;

import com.andregattermeyer.api_cadastro_pecas_e_ferramentas.model.Peca;

public interface PecaRepository extends JpaRepository<Peca, Long> {

    // Busca peça pelo código
    Optional<Peca> findByCodigo(String codigo);

    long countByNomePecaStartingWith(String prefixo);

    Optional<Peca> findByCodigoAndAtivoTrue(String codigo);

    List<Peca> findAllByAtivoTrue();

}
