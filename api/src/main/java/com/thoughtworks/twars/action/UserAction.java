package com.thoughtworks.twars.action;

import com.thoughtworks.twars.User;
import com.thoughtworks.twars.data.UserMapper;
import com.thoughtworks.twars.db.DBUtil;
import org.apache.ibatis.session.SqlSession;

import javax.ws.rs.*;
import javax.ws.rs.core.MediaType;

@Path("/user")
public class UserAction {

    UserMapper mapper;

    public UserAction() {
        SqlSession session = DBUtil.getSession();
        mapper = session.getMapper(com.thoughtworks.twars.data.UserMapper.class);
    }

    @GET
    @Path("/{param}")
    @Produces(MediaType.APPLICATION_JSON)
    public User getInsert(@PathParam("param") int userId) {

        User user = mapper.getUserById(userId);
        return user;
    }

    @POST
    @Consumes(MediaType.APPLICATION_JSON)
    @Produces(MediaType.APPLICATION_JSON)
    public User getInsert(User user) {
        mapper.insertUser(user);
        return user;
    }
}
