package com.andregattermeyer.api_cadastro_pecas_e_ferramentas.model;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import com.fasterxml.jackson.annotation.JsonSetter;
import com.fasterxml.jackson.annotation.Nulls;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.SequenceGenerator;
import jakarta.validation.constraints.NotNull;

@Entity
@JsonIgnoreProperties({"hibernateLazyInitializer", "handler"})
public class Lote {

    @Id
    @GeneratedValue(strategy = GenerationType.SEQUENCE, generator = "lote_seq")
    @SequenceGenerator(name = "lote_seq", sequenceName = "lote_seq", allocationSize = 1)
    private Long id;

    @NotNull
    private Integer quantidade;

    @JsonSetter(nulls = Nulls.SKIP)
    private Boolean pacoteFechado = false;

    @ManyToOne(optional = false)
    @JoinColumn(name = "peca_id", nullable = false)
    @JsonIgnoreProperties({"especificacoes", "lotes"})
    private Peca peca;

    @Column(nullable = false)
    @JsonSetter(nulls = Nulls.SKIP)
    private Boolean ativo = true;

    public Lote() {
    }

    public Lote(Integer quantidade, Boolean pacoteFechado, Peca peca) {
        this.quantidade = quantidade;
        this.pacoteFechado = pacoteFechado != null ? pacoteFechado : false;
        this.peca = peca;
        this.ativo = true;
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public Integer getQuantidade() {
        return quantidade;
    }

    public void setQuantidade(Integer quantidade) {
        this.quantidade = quantidade;
    }

    public Boolean getPacoteFechado() {
        return pacoteFechado;
    }

    public void setPacoteFechado(Boolean pacoteFechado) {
        this.pacoteFechado = pacoteFechado != null ? pacoteFechado : false;
    }

    public Peca getPeca() {
        return peca;
    }

    public void setPeca(Peca peca) {
        this.peca = peca;
    }

    public Boolean getAtivo() {
        return ativo;
    }

    public void setAtivo(Boolean ativo) {
        this.ativo = ativo != null ? ativo : true;
    }
}
