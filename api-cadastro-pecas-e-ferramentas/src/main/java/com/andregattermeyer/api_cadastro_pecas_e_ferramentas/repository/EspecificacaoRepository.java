package com.andregattermeyer.api_cadastro_pecas_e_ferramentas.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;

import com.andregattermeyer.api_cadastro_pecas_e_ferramentas.model.Especificacao;

public interface EspecificacaoRepository extends JpaRepository<Especificacao, Long> {
    
    List<Especificacao> findByPecaId(Long pecaId);

}
